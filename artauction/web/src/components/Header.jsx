import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import logo from '../assets/logo.png';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import '../styles/header.css';

const Header = ({ onLogin }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    };

    useEffect(() => {
        checkLoginStatus();

        // Listen for custom event from Login page
        const handleAuthChange = () => checkLoginStatus();
        window.addEventListener('auth-change', handleAuthChange);

        // Listen for storage events (cross-tab sync)
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    const handleAuthClick = async () => {
        if (isLoggedIn) {
            // Logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('role');
            localStorage.removeItem('full_name');

            setIsLoggedIn(false);
            window.dispatchEvent(new Event('auth-change')); // Notify other components if needed
            window.location.hash = '#/home';
        } else if (typeof onLogin === 'function') {
            onLogin();
        } else {
            window.location.hash = '#/login';
        }
    };

    return (
        <AppBar position="static" className="header-appbar">
            <Toolbar className="header-toolbar">
                <img src={logo} alt="Art Auction Logo" className="header-logo" />
                <Box className="nav-actions">
                    <Box
                        component={Link}
                        to="/home"
                        aria-label="Go to Home"
                        className="nav-item nav-link"
                        onClick={(e) => { e.stopPropagation(); }}
                    >
                        <HomeOutlined className="nav-icon" />
                        <Typography className="nav-text" variant="body1">Home</Typography>
                    </Box>

                    {isLoggedIn && localStorage.getItem('role') === 'artist' && (
                        <Box
                            component={Link}
                            to="/dashboard"
                            aria-label="Go to Artist Dashboard"
                            className="nav-item nav-link"
                            onClick={(e) => { e.stopPropagation(); }}
                        >
                            <DashboardOutlined className="nav-icon" />
                            <Typography className="nav-text" variant="body1">My Artworks</Typography>
                        </Box>
                    )}

                    <Box
                        className="nav-item login"
                        onClick={handleAuthClick}
                    >
                        <PersonOutline className="nav-icon" />
                        <Typography className="nav-text" variant="body1">{isLoggedIn ? 'Log out' : 'Log in'}</Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
