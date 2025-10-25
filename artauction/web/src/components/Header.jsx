import React from "react";
import PersonOutline from '@mui/icons-material/PersonOutline';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import logo from '../assets/logo.png';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import '../styles/header.css';

const Header = () => {
  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar className="header-toolbar">
        <img src={logo} alt="Art Auction Logo" className="header-logo" />
        <Box className="nav-actions">
          <Box
            component="a"
            href="/"
            aria-label="Go to Home"
            className="nav-item nav-link"
          >
            <HomeOutlined className="nav-icon" />
            <Typography className="nav-text" variant="body1">Home</Typography>
          </Box>
          <Box
            className="nav-item login"
            onClick={() => alert('Login functionality to be implemented')}
          >
            <PersonOutline className="nav-icon" />
            <Typography className="nav-text" variant="body1">Log in</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
