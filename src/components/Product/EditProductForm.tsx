import { InsertPhoto, LocalGroceryStoreOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, CircularProgress, Container, CssBaseline, Grid, IconButton, Link, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Product } from '../../app/types';
import { authClear } from '../Auth/authSlice';
import { writeProductSuccess, getProduct, productFailure, editProduct } from './productSlice';

const EditProductForm = () => {
    const isLoading = useAppSelector((state) => state.products.isLoading);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.auth.data);
    const { id } = useParams();
    const [editedProduct, setEditedProduct] = useState({
        sku: '',
        title: '',
        image: ''
    });

    const [serverError, setServerError] = useState<string>('');
    const [errors, setErrors] = useState({
        skuError: '',
        titleError: '',
        imageError: ''
    });
    const [imageFile, setImageFile] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>();

    useEffect(() => {
        if (userInfo?.result.email && userInfo?.token) {
            dispatch(getProduct(String(id))).then((res) => {
                setEditedProduct(res.payload);
                setImagePreview(res.payload.image);
                const imageType = res.payload.image.split('/')[4].split('.')[1];
                const blob = new Blob([res.payload.image], { type: `image/${imageType}` });
                const file = new File([blob], res.payload.image, { type: blob.type });
                setImageFile(file);
            });
        } else {
            dispatch(authClear());
            navigate('/login');
        }
    }, [id]);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        setImageFile(files![0]);
        setImagePreview(URL.createObjectURL(files![0]));
    };

    const validateRegistration = ({ sku, title, image }: Product) => {
        const newErrors = { skuError: '', titleError: '', imageError: '' };
        if (sku === 0) {
            newErrors.skuError = 'SKU must be higher than 0';
        } else if (title.trim() === '') {
            newErrors.titleError = 'Title must not be empty';
        }
        if (image === null) {
            newErrors.imageError = 'Product must come with an image!';
        }
        if (newErrors.skuError || newErrors.titleError || newErrors.imageError) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({ skuError: '', titleError: '', imageError: '' });
        if (validateRegistration({ sku: Number(editedProduct.sku), title: editedProduct.title, image: imageFile! })) {
            const formData = new FormData();
            formData.append('image', imageFile!);
            formData.append('SKU', editedProduct.sku.toString());
            formData.append('newTitle', editedProduct.title);
            const oldID = String(id);
            dispatch(editProduct({ oldID, formData })).then((res) => {
                if (res.type === 'products/editProduct/rejected') {
                    dispatch(productFailure(res.payload));
                    setServerError(res.payload.data.message);
                } else if (res.type === 'products/editProduct/fulfilled') {
                    dispatch(writeProductSuccess());
                    navigate('/dashboard');
                }
            });
        }
    };

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LocalGroceryStoreOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Edit product
                    </Typography>
                    {serverError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{serverError}</Typography>}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="sku"
                                    label="Enter SKU for Product"
                                    name="sku"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={Number(editedProduct.sku)}
                                    onChange={handleOnChange}
                                />
                                {errors.skuError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{errors.skuError}</Typography>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="title" label="Enter Product Title" id="title" value={editedProduct.title} onChange={handleOnChange} />
                                {errors.titleError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{errors.titleError}</Typography>}
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography component="h4" variant="h6">
                                    {imagePreview ? 'Change Product Image' : 'Upload Product Image'}
                                </Typography>
                                <input type="file" id="icon-button-file" accept="image/*" style={{ display: 'none' }} onChange={handleSelectImage} />
                                <label htmlFor="icon-button-file">
                                    <IconButton color="primary" aria-label="upload picture" component="span" size="large">
                                        <InsertPhoto />
                                    </IconButton>
                                </label>
                                {errors.imageError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{errors.imageError}</Typography>}
                                {imagePreview && <img src={imagePreview} width="200" height="200" />}
                            </Grid>
                        </Grid>
                        <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Edit Product
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/dashboard" variant="body2">
                                    Go back to Dashboard
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default EditProductForm;
