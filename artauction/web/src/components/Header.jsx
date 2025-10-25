import React from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
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
            className="nav-item"
            onClick={() => alert('Login functionality to be implemented')}
          >
            <AccountCircle className="nav-icon login-icon" />
            <Typography className="nav-text login-text" variant="body1">Log in</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
