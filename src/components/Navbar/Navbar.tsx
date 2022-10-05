import { AppBar, Typography, Toolbar, Button, Container, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authClear } from '../Auth/authSlice';
import { resetData } from '../Product/productSlice';

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.auth.data);
    const handleSignOut = () => {
        dispatch(resetData());
        dispatch(authClear());
        navigate('/');
    };
    // appbar with mightyjaxx on left side, email and signout option flushed to right
    return (
        <AppBar position="static" style={{ background: '#fccf01', display: 'flex' }} color="primary">
            <CssBaseline />
            <Container maxWidth="lg">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, color: '#222222' }}>
                        Mighty Jaxx Admin Board
                    </Typography>
                    {userInfo && <Typography sx={{ display: { sm: 'block' }, color: '#494949' }}>{userInfo.result.email}</Typography>}
                    <Button onClick={handleSignOut}>Sign Out</Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
