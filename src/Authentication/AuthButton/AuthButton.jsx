import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUserCircle } from 'react-icons/fa'; 

const AuthButton = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication status on component mount
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        // Listen for changes in localStorage, especially for login events
        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem('token');
            setIsAuthenticated(!!updatedToken);
        };

        // Add event listener for localStorage changes
        window.addEventListener('storage', handleStorageChange);

        return () => {
            // Clean up the event listener on component unmount
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token'); 
        Swal.fire({
            icon: 'success',
            title: 'Signed out successfully',
            showConfirmButton: false,
            timer: 2000
        });
        navigate('/login');
        setIsAuthenticated(false);
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleDashboardRedirect = () => {
        // Directly navigating to admin dashboard
        navigate('/dashboard/adminHome');
    };

    return (
        <>
            {isAuthenticated ? (
                <div className="relative top-3 ">

                    <FaUserCircle 
                        className="text-4xl cursor-pointer"
                        onMouseEnter={() => setIsDropdownVisible(true)}
                        onMouseLeave={() => setIsDropdownVisible(false)}
                    />

                    {isDropdownVisible && (
                        <div 
                            className="absolute right-0 w-48 bg-primary shadow-lg rounded-md z-50"
                            onMouseEnter={() => setIsDropdownVisible(true)}
                            onMouseLeave={() => setIsDropdownVisible(false)}
                        >
                            <button 
                                onClick={handleDashboardRedirect} 
                                className="block w-full px-4 py-2 text-left text-white "
                            >
                                Dashboard
                            </button>
                            <button 
                                onClick={handleSignOut} 
                                className="block w-full px-4 py-2 text-left text-white "
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={handleLoginRedirect} className="button px-10">
                    Login
                </button>
            )}
        </>
    );
};

export default AuthButton;
