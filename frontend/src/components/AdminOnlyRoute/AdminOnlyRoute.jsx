import React from 'react';
import { Navigate } from 'react-router-dom';

// AdminOnlyRoute component
const AdminOnlyRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('lottery:user'));
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminOnlyRoute;