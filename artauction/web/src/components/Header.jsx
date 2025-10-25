import React from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo.png';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import '../styles/header.css';

const Header = () => {
  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar className="header-toolbar">
        <img src={logo} alt="Art Auction Logo" className="header-logo" />
        <Box
          className="login-container"
          onClick={() => alert('Login functionality to be implemented')}
        >
          <AccountCircle className="login-icon" />
          <Typography className="login-text" variant="body1">Log in</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
