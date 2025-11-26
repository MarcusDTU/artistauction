import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import '../styles/login.css';
import { supabase } from '../lib/supabaseClient';
import { extractTokensFromUrl } from '../utils/tokenParser';

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
      console.log('[ResetPassword] Starting token detection...');

      // 1. Check active Supabase session first
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('[ResetPassword] Found active session');
        setTokens({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
        return;
      }

      // 2. Extract tokens from URL using improved parser
      const urlTokens = extractTokensFromUrl();
      if (urlTokens) {
        console.log('[ResetPassword] Found tokens in URL');
        setTokens(urlTokens);
        
        // Try to set the session with extracted tokens
        try {
          const { error } = await supabase.auth.setSession(urlTokens);
          if (error) {
            console.error('[ResetPassword] Failed to set session:', error);
            setError(`Authentication error: ${error.message}`);
          } else {
            console.log('[ResetPassword] Session set successfully');
          }
        } catch (err) {
          console.error('[ResetPassword] Session setting failed:', err);
          setError(`Failed to authenticate: ${err.message}`);
        }
        return;
      }

      // 3. Check for errors in URL
      const fullUrl = window.location.href;
      const errorMatch = fullUrl.match(/error=([^&]+)/);
      const errorDescMatch = fullUrl.match(/error_description=([^&]+)/);

      if (errorMatch) {
        const errorMsg = decodeURIComponent(errorMatch[1]);
        const errorDesc = errorDescMatch ? decodeURIComponent(errorDescMatch[1]) : '';
        console.log('[ResetPassword] Found error in URL:', errorMsg);
        setError(errorDesc || errorMsg);
      }

      console.log('[ResetPassword] No valid tokens found');
    };

    checkSession();

    // 4. Listen for auth state changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[ResetPassword] Auth event:', event);
      if (session && session.access_token && session.refresh_token) {
        setTokens({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
        setError(''); // Clear any existing errors
      }
    });

    return () => {
      authListener?.data?.subscription?.unsubscribe();
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
