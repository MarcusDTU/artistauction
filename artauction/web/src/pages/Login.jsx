import React, { useState } from 'react';
import { Box, Button, Tab, Tabs, TextField, Typography, InputAdornment } from '@mui/material';
import MailOutline from '@mui/icons-material/MailOutline';
import LockOutlined from '@mui/icons-material/LockOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import '../styles/login.css';
import logo from '../assets/logo.png';

const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';

const Login = () => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Sign Up
  const [signupErrors, setSignupErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');

    try {
      const res = await fetch(`${API_HOST}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store session and profile info
      if (data.session) {
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
      }

      if (data.profile) {
        localStorage.setItem('role', data.profile.role);
        localStorage.setItem('full_name', data.profile.full_name);
      }

      // Store email for dashboard access
      if (data.user?.email) {
        localStorage.setItem('user_email', data.user.email);
      } else {
        localStorage.setItem('user_email', email);
      }

      window.dispatchEvent(new Event('auth-change'));
      window.location.hash = '#/home';
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const form = new FormData(e.currentTarget);
    const name = form.get('name');
    const email = form.get('email');
    const password = form.get('password');
    const confirm = form.get('confirm');

    // Default role is buyer
    const role = 'buyer';

    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password !== confirm) errors.confirm = 'Passwords do not match';

    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_HOST}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
          role
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        // If response is not JSON (e.g. 500 error page), treat as error
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Success
      alert('Account created successfully! Please check your email to confirm your account before logging in.');
      setTab(0); // Switch to login tab
    } catch (err) {
      console.error("Signup Error:", err);
      setAuthError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <a className="back-link" href="#/home">← Back to Home</a>

      <Box className="login-card" component="section">
        <img src={logo} alt="Art Auction Logo" className="login-logo" />
        <Typography variant="h4" className="login-title">Welcome Back</Typography>
        <Typography variant="body2" className="login-subtitle">
          Sign in to explore exclusive artworks
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} className="login-tabs" aria-label="auth tabs">
          <Tab label="Login" id="tab-login" aria-controls="panel-login" />
          <Tab label="Sign Up" id="tab-signup" aria-controls="panel-signup" />
        </Tabs>

        {tab === 0 && (
          <form className="login-form" id="panel-login" aria-labelledby="tab-login" onSubmit={handleLoginSubmit}>
            <label htmlFor="email" className="field-label">Email</label>
            <TextField
              id="email"
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

            <label htmlFor="password" className="field-label">Password</label>
            <TextField
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              size="small"
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" className="login-submit" variant="contained" disabled={loading}>
              Sign In
            </Button>
            {authError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {authError}
              </Typography>
            )}
          </form>
        )}

        {tab === 1 && (
          <form className="login-form" id="panel-signup" aria-labelledby="tab-signup" onSubmit={handleSignupSubmit}>
            <label htmlFor="name" className="field-label">Full Name</label>
            <TextField
              id="name"
              name="name"
              type="text"
              placeholder="Asma Maryam"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={Boolean(signupErrors.name)}
              helperText={signupErrors.name || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <label htmlFor="signup-email" className="field-label">Email</label>
            <TextField
              id="signup-email"
              name="email"
              type="email"
              placeholder="artist@example.com"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={Boolean(signupErrors.email)}
              helperText={signupErrors.email || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <label htmlFor="signup-password" className="field-label">Password</label>
            <TextField
              id="signup-password"
              name="password"
              type="password"
              placeholder="Create a password"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={Boolean(signupErrors.password)}
              helperText={signupErrors.password || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <label htmlFor="confirm" className="field-label">Confirm Password</label>
            <TextField
              id="confirm"
              name="confirm"
              type="password"
              placeholder="Re-enter password"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={Boolean(signupErrors.confirm)}
              helperText={signupErrors.confirm || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" className="login-submit" variant="contained" disabled={loading}>
              Create Account
            </Button>
            {authError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {authError}
              </Typography>
            )}
          </form>
        )}

        <a className="link-button" href="#/forgot">Forgot password?</a>
      </Box>
    </div>
  );
};

export default Login;
