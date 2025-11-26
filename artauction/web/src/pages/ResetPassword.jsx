import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import '../styles/login.css';
import { supabase } from '../lib/supabaseClient';

const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState({});

  useEffect(() => {
    const checkSession = async () => {
      console.log('[ResetPassword] Checking session...');

      // 1. Check active Supabase session (most reliable if App.jsx already handled the hash)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('[ResetPassword] Found active session');
        setTokens({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
        return;
      }

      // 2. Fallback: Parse URL hash manually using regex for robustness
      const fullUrl = window.location.href;
      console.log('[ResetPassword] Full URL:', fullUrl);

      // Check for error passed from App.jsx or Supabase
      const errorMatch = fullUrl.match(/error=([^&]+)/);
      const errorDescMatch = fullUrl.match(/error_description=([^&]+)/);

      if (errorMatch) {
        const errorMsg = decodeURIComponent(errorMatch[1]);
        const errorDesc = errorDescMatch ? decodeURIComponent(errorDescMatch[1]) : '';
        console.log('[ResetPassword] Found error in URL:', errorMsg);
        setError(errorDesc || errorMsg); // Prefer description if available
        // We don't return here, in case tokens are also present (though unlikely to work if error exists)
      }

      const atMatch = fullUrl.match(/access_token=([^&]+)/);
      const rtMatch = fullUrl.match(/refresh_token=([^&]+)/);

      const at = atMatch ? decodeURIComponent(atMatch[1]) : null;
      const rt = rtMatch ? decodeURIComponent(rtMatch[1]) : null;

      if (at && rt) {
        console.log('[ResetPassword] Found tokens via regex');
        setTokens({ access_token: at, refresh_token: rt });
        return;
      }
    };

    checkSession();

    // 3. Listen for auth state changes (Critical for race conditions)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[ResetPassword] Auth event:', event);
      if (session) {
        setTokens({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!password) { setError('Password is required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!tokens.access_token) { setError('Invalid or missing recovery link. Please try requesting a new password reset.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_HOST}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Password update failed');
      }

      setStatus('Password updated. You can now log in.');
      setTimeout(() => { window.location.hash = '#/login'; }, 2000);
    } catch (e1) {
      setError(e1.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <a className="back-link" href="#/home">↩ Back to Home</a>

      <Box className="login-card" component="section">
        <Typography variant="h4" className="login-title">Reset Password</Typography>
        {!tokens.access_token && (
          <Typography variant="body2" className="login-subtitle" sx={{ mb: 1, color: 'warning.main' }}>
            Warning: No recovery token found. Please ensure you clicked the link in your email.
          </Typography>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="new-password" className="field-label">New Password</label>
          <TextField
            id="new-password"
            name="password"
            type="password"
            placeholder="Create a new password"
            variant="outlined"
            size="small"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined className="input-icon" />
                </InputAdornment>
              ),
            }}
          />

          <label htmlFor="confirm-password" className="field-label">Confirm Password</label>
          <TextField
            id="confirm-password"
            name="confirm"
            type="password"
            placeholder="Re-enter password"
            variant="outlined"
            size="small"
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined className="input-icon" />
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" className="login-submit" variant="contained" disabled={loading}>
            Update Password
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

export default ResetPassword;
