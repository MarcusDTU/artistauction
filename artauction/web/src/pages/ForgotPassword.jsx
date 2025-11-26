import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import MailOutline from '@mui/icons-material/MailOutline';
import '../styles/login.css';
//import { supabase } from '../lib/supabaseClient';

const ForgotPassword = () => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';

    try {
      // Use origin+pathname only; Supabase will append recovery tokens in the hash.
      // App.jsx will detect them and route to #/reset after setting the session.
      const redirectTo = `${window.location.origin}${window.location.pathname}`;

      const res = await fetch(`${API_HOST}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      setStatus('Check your email for a password reset link.');
    } catch (e1) {
      setError(e1.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
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

          <Button type="submit" className="login-submit" variant="contained" disabled={loading}>
            Send Reset Link
          </Button>
          {status && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
              {status}
            </Typography>
          )}
          {error && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              {error}
            </Typography>
          )}
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

