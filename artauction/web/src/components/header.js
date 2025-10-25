import React from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo  from '../assets/logo.png';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import createDropdownMenu from "./DropdownMenu";

const artistItems = [
    {label: 'Artist 1', to: '#', onClick: () => alert('Not yet implemented')},
    {label: 'Artist 2', to: '#', onClick: () => alert('Not yet implemented')},
    {label: 'Artist 3', to: '#', onClick: () => alert('Not yet implemented')},
];

const ArtistsDropdown = createDropdownMenu(artistItems, { buttonLabel: 'View Artists' });

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#e5ebe4", color: "#44543f", paddingY: 1 }}>
        <Toolbar sx={{ position: 'relative', minHeight: 100 }}>
            {/* logo wrapper: positioned ancestor for the dropdown */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '100%',
                    mr: 2,
                    '& .logo-dropdown > button': {
                        position: 'absolute',
                        bottom: 10,
                        left: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        padding: '6px 10px',
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                        backgroundColor: 'transparent',
                        border: '1px solid',
                        borderColor: 'rgba(0,0,0,0.12)',
                        borderRadius: 1,
                        cursor: 'pointer',
                    },
                    '& .logo-dropdown > button:focus': {
                        outline: 'none'
                    }
                }}
            >
                <img src={logo} alt="Art Auction Logo" style={{ height: 60, display: 'block' }} />
                <ArtistsDropdown className="logo-dropdown" />
            </Box>

            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: "3px 6px",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        "&:hover .login-icon": { color: "#2e7516" },
                        "&:hover .login-text": { color: "#2e7516" },
                    }}
                    onClick={() => alert('Login functionality to be implemented')}
                >
                    <AccountCircle className="login-icon" sx={{ fontSize: 25 }} />
                    <Typography className="login-text" sx={{ fontSize: 13 }} variant="body1">Log in</Typography>
                </Box>
            </Box>
        </Toolbar>
    </AppBar>
  );
};

export default Header;
