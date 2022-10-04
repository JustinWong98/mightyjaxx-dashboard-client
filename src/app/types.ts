// Type definitions for Typescript

export interface Product {
    sku: number;
    title: string;
    image: File | null;
}

export interface ProductListing {
    sku: number;
    title: string;
    image: string;
}

export interface signupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface loginFormData {
    email: string;
    password: string;
}

export interface IAuth {
    token: string | null;
    email: string | null;
    handleLogin: () => void;
    handleLogout: () => void;
}

export interface IServerData {
    result: {
        _id: string;
        email: string;
        hashedPassword: string;
        __v: number;
    };
    token: string;
}
