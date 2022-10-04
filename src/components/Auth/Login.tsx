import { useState, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Container, Avatar, Button, TextField, Link, Grid, Box, Typography, CssBaseline, CircularProgress } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { IServerData, loginFormData } from '../../app/types';
import { authPending, loginAdmin, authFailure, authSuccess } from './authSlice';
import { PayloadAction } from '@reduxjs/toolkit';

const Login = () => {
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useAppDispatch();
    const isLoading: boolean = useAppSelector((state) => state.auth.isLoading);
    const serverError: string | null = useAppSelector((state) => state.auth.error);
    const [showServerError, setShowServerError] = useState<string | null>('');
    const userInfo: IServerData | null = useAppSelector((state) => state.auth.data);
    const [values, setValues] = useState<loginFormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        emailError: '',
        passwordError: ''
    });

    useEffect(() => {
        if (userInfo?.result.email && userInfo?.token) {
            navigate('/dashboard');
        }
    }, []);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const validateRegistration = ({ password, email }: loginFormData) => {
        const newErrors = { emailError: '', passwordError: '' };
        if (email.trim() === '') {
            newErrors.emailError = 'Email must not be empty';
        }
        // Make sure the admin is a valid employee of the company - should have a company email
        else if (email.split('@')[1] !== 'mightyjaxx.com') {
            newErrors.emailError = 'Email must be a MightyJaxx email';
        }
        if (password === '') {
            newErrors.passwordError = 'Password must not empty';
        }
        if (newErrors.emailError || newErrors.passwordError) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateRegistration(values)) {
            dispatch(authPending());
            dispatch(loginAdmin(values)).then((res: PayloadAction<any>) => {
                if (res.type === 'auth/login/rejected') {
                    dispatch(authFailure(res.payload));
                    setShowServerError(res.payload.data.message);
                } else if (res.type === 'auth/login/fulfilled') {
                    dispatch(authSuccess(res.payload));
                    navigate('/dashboard');
                }
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
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
                        <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {serverError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{showServerError}</Typography>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus onChange={handleOnChange} />
                                {errors.emailError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{errors.emailError}</Typography>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={handleOnChange}
                                />
                                {errors.passwordError && <Typography sx={{ fontWeight: 'bold', color: '#cc0000' }}>{errors.passwordError}</Typography>}
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Login;
