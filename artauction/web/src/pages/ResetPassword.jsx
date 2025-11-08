import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import '../styles/login.css';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    async function init() {
      try {
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else if (window.location.hash && window.location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
          }
        }
      } catch (_) {
        // ignore; UI will show guidance message
      } finally {
        if (!active) return;
        const { data } = await supabase.auth.getSession();
        setHasRecoverySession(Boolean(data.session));
      }
    }
    init();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecoverySession(Boolean(session));
      }
    });
    return () => { data.subscription.unsubscribe(); active = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    if (!password) { setError('Password is required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!hasRecoverySession) { setError('Auth session missing! Open the link from the email again.'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setStatus('Password updated. You can now log in.');
      setTimeout(() => { window.location.hash = '#/login'; }, 1000);
    } catch (e1) {
      setError(e1.message || 'Failed to update password. Open the link from your email again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <a className="back-link" href="#/home">↩ Back to Home</a>

      <Box className="login-card" component="section">
        <Typography variant="h4" className="login-title">Reset Password</Typography>
        {!hasRecoverySession && (
          <Typography variant="body2" className="login-subtitle" sx={{ mb: 1 }}>
            Open the reset link from your email to continue.
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

