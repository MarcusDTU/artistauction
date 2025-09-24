import React from "react";
import logo  from '../assets/logo.png';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
const Header = () => {
  return (
    <AppBar position="static" color="transparent" sx={{ paddingY: 0.5 }}>
      <Toolbar>
        <img src={logo} alt="Art Auction Logo" style={{ height: 60 }} />
        <Typography variant="h6"></Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>

  );
};

export default Header;
