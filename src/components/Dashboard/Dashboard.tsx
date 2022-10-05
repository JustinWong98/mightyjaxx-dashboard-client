import { Container, Box, Grid, CssBaseline, CircularProgress, Button, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect, useState } from 'react';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';

import ProductCard from '../Product/ProductCard';
import { fetchProducts } from '../Product/productSlice';
import { ProductListing } from '../../app/types';
import Navbar from '../Navbar/Navbar';
import background from '../../images/MightyJaxxIMG.jpg';
import { authClear } from '../Auth/authSlice';

export const Dashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector((state) => state.products.isLoading);
    const products = useAppSelector((state: RootState) => state.products.productList);
    const totalPages = useAppSelector((state) => state.products.totalPageNumber);
    const [page, setPage] = useState(1);
    const userInfo = useAppSelector((state) => state.auth.data);
    useEffect(() => {
        console.log(products);
        if (userInfo?.result.email && userInfo?.token) {
            dispatch(fetchProducts(page));
        } else {
            dispatch(authClear());
            navigate('/login');
        }
    }, [page]);
    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                backgroundSize: 'cover',
                background: `linear-gradient(
                    rgba(0, 0, 0, 0.4), 
                    rgba(0, 0, 0, 0.4)
                  ), url(${background})`,
                height: {
                    xs: '100%',
                    sm: '100vh'
                },
                width: {
                    sm: '100vw'
                },
                backgroundRepeat: 'repeat',
                backgroundAttachment: 'fixed',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <CssBaseline />
            <Navbar />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyItems: 'center'
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {
                            navigate('/addProduct');
                        }}
                    >
                        Add a New Product
                    </Button>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} maxWidth={'70vw'}>
                        {products.map((product: ProductListing) => (
                            <Grid item xs={4}>
                                <ProductCard key={product.sku} sku={product.sku} title={product.title} image={product.image} />
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        count={totalPages}
                        variant="outlined"
                        page={page}
                        color="primary"
                        sx={{
                            backgroundColor: '#c49e00',
                            my: '5vh',
                            scale: {
                                xs: '120%',
                                md: '100%'
                            }
                        }}
                        shape="rounded"
                        onChange={(e, value) => setPage(value)}
                    />
                </Box>
            )}
        </Container>
    );
};
