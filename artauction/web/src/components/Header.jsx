import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import logo from '../assets/logo.png';
import {AppBar, Toolbar, Typography, Box} from '@mui/material';
import '../styles/header.css';
import { supabase } from '../backend/services/supabaseClient';

const Header = ({onLogin}) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        let mounted = true;
        supabase.auth.getSession().then(({ data }) => {
            if (mounted) setSession(data.session ?? null);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });
        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const handleAuthClick = async () => {
        if (session) {
            await supabase.auth.signOut();
            try {
                localStorage.removeItem('role');
                localStorage.removeItem('full_name');
            } catch (_) {}
            window.location.hash = '#/home';
        } else if (typeof onLogin === 'function') {
            onLogin();
        } else {
            window.location.hash = '#/login';
        }
    };

    const isLoggedIn = Boolean(session);

    return (
        <AppBar position="static" className="header-appbar">
            <Toolbar className="header-toolbar">
                <img src={logo} alt="Art Auction Logo" className="header-logo"/>
                <Box className="nav-actions">
                    <Box
                        component={Link}
                        to="/home"
                        aria-label="Go to Home"
                        className="nav-item nav-link"
                        onClick={(e)=>{ e.stopPropagation(); }}
                    >
                        <HomeOutlined className="nav-icon"/>
                        <Typography className="nav-text" variant="body1">Home</Typography>
                    </Box>

                    <Box
                        component={Link}
                        to="/dashboard"
                        aria-label="Go to Artist Dashboard"
                        className="nav-item nav-link"
                        onClick={(e)=>{ e.stopPropagation(); }}
                    >
                        <DashboardOutlined className="nav-icon"/>
                        <Typography className="nav-text" variant="body1">My Artworks</Typography>
                    </Box>

                    <Box
                        className="nav-item login"
                        onClick={handleAuthClick}
                    >
                        <PersonOutline className="nav-icon"/>
                        <Typography className="nav-text" variant="body1">{isLoggedIn ? 'Log out' : 'Log in'}</Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
