import React from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import MailOutline from '@mui/icons-material/MailOutline';
import '../styles/login.css';

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Password reset link sent (demo)');
  };

  return (
    <div className="login-page">
      <a className="back-link" href="#/home">← Back to Home</a>

      <Box className="login-card" component="section">
        <Typography variant="h4" className="login-title">Forgot Password</Typography>
        <Typography variant="body2" className="login-subtitle">
          Enter your email and we will send you a reset link
        </Typography>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="forgot-email" className="field-label">Email</label>
          <TextField
            id="forgot-email"
            name="email"
            type="email"
            placeholder="artist@example.com"
            variant="outlined"
            size="small"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline className="input-icon" />
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" className="login-submit" variant="contained">
            Send Reset Link
          </Button>
        </form>

        <button
          type="button"
          className="link-button"
          onClick={() => { window.location.hash = '#/login'; }}
        >
          Back to Login
        </button>
      </Box>
    </div>
  );
};

export default ForgotPassword;

