import React from 'react';
import { Box, Button, Tab, Tabs, TextField, Typography } from '@mui/material';
import MailOutline from '@mui/icons-material/MailOutline';
import LockOutlined from '@mui/icons-material/LockOutlined';
import '../styles/login.css';
import logo from '../assets/logo.png';

const Login = () => {
  return (
    <div className="login-page">
      <a className="back-link" href="#/home">← Back to Home</a>

      <Box className="login-card" component="section">
        <img src={logo} alt="Art Auction Logo" className="login-logo" />
        <Typography variant="h4" className="login-title">Welcome Back</Typography>
        <Typography variant="body2" className="login-subtitle">
          Sign in to explore exclusive artworks
        </Typography>

        <Tabs value={0} className="login-tabs" aria-label="auth tabs">
          <Tab label="Login" />
          <Tab label="Sign Up" disabled />
        </Tabs>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="email" className="field-label">Email</label>
          <Box className="input-wrapper">
            <MailOutline className="input-icon" />
            <TextField
              id="email"
              type="email"
              placeholder="artist@example.com"
              variant="outlined"
              size="small"
              fullWidth
              required
              InputProps={{ className: 'input-text' }}
            />
          </Box>

          <label htmlFor="password" className="field-label">Password</label>
          <Box className="input-wrapper">
            <LockOutlined className="input-icon" />
            <TextField
              id="password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              size="small"
              fullWidth
              required
              InputProps={{ className: 'input-text' }}
            />
          </Box>

          <Button type="submit" className="login-submit" variant="contained">
            Sign In
          </Button>
        </form>

        <button
          type="button"
          className="link-button"
          onClick={() => alert('Forgot password flow is not implemented yet')}
        >
          Forgot password?
        </button>
      </Box>

      <Typography variant="body2" className="support-note">
        Need help? <a href="#/support" onClick={(e) => e.preventDefault()}>Contact Support</a>
      </Typography>
    </div>
  );
};

export default Login;

