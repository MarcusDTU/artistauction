import React from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo  from '../assets/logo.png';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#e5ebe4", color: "#44543f", paddingY: 0.5 }}>
      <Toolbar>
        <img src={logo} alt="Art Auction Logo" style={{ height: 60 }} />
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: "auto" ,
            padding: "3px 6px",
            borderRadius: "8px",
            transition: "all 0.3s ease",
          "&:hover .login-icon": {
            color: "#2e7516"
            },
         "&:hover .login-text": {
            color: "#2e7516"
            },
        }}
            onClick={() => alert('Login functionality to be implemented')}
             >
          <AccountCircle className="login-icon" sx={{ fontSize: 25 }} />
        <Typography className="login-text" sx={{ fontSize: 13 }} variant="body1">Login</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
