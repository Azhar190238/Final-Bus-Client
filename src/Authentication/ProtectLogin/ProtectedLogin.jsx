/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedLogin = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // If the user is logged in, redirect to the home page
            navigate('/');
        }
    }, [navigate]);

    return (
        // If no token exists, render the login page (children)
        <>
            {!localStorage.getItem('token') && children}
        </>
    );
};

export default ProtectedLogin;
