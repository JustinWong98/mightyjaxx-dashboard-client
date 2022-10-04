import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Homepage from './components/Dashboard/Homepage';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import { Dashboard } from './components/Dashboard/Dashboard';
import ProductForm from './components/Product/ProductForm';
import EditProductForm from './components/Product/EditProductForm';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/addProduct" element={<ProductForm />} />
                <Route path="/product/:id" element={<EditProductForm />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
