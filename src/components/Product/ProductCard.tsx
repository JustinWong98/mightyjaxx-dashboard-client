import { Card, CardActionArea, CardMedia, CardActions, Typography, CardContent, Button, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ProductListing } from '../../app/types';
import { useAppDispatch } from '../../app/hooks';
import { deleteProduct, productFailure, writeProductSuccess } from './productSlice';

const ProductCard = ({ sku, title, image }: ProductListing) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleDelete = async () => {
        const deleteRes = await dispatch(deleteProduct(sku));
        if (deleteRes.type === 'products/deleteProduct/rejected') {
            dispatch(productFailure(deleteRes.payload));
        } else if (deleteRes.type === 'products/deleteProduct/fulfilled') {
            dispatch(writeProductSuccess());
        }
    };

    return (
        <Card sx={{ maxWidth: 310, transition: 'transform 0.15s ease-in-out', height: 300, backgroundColor: '#fccf01' }}>
            <CardActionArea>
                <CardMedia component="img" height="140" image={image} alt={`${title}`} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        SKU: {sku}
                    </Typography>
                    <Typography gutterBottom variant="body1" component="div">
                        {title}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Link style={{ textDecoration: 'none' }} to={`/dashboard}`}>
                    <Button size="medium" color="warning" onClick={handleDelete}>
                        Delete
                    </Button>
                </Link>
                <Link style={{ textDecoration: 'none' }} to={`/product/${sku}`}>
                    <Button size="medium" color="info">
                        Edit
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
