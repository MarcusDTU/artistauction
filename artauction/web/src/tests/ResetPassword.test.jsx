import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ResetPassword from '../pages/ResetPassword';

// Mock the token parser utility
jest.mock('../utils/tokenParser', () => ({
  extractTokensFromUrl: jest.fn()
}));

// Mock Supabase client
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      setSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}));

// Mock global fetch
global.fetch = jest.fn();
global.alert = jest.fn();

describe('ResetPassword Token Detection', () => {
  const { extractTokensFromUrl } = require('../utils/tokenParser');
  const { supabase } = require('../lib/supabaseClient');

  beforeEach(() => {
    jest.clearAllMocks();
    extractTokensFromUrl.mockReturnValue(null);
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.setSession.mockResolvedValue({ error: null });
  });

  test('shows warning when no tokens are found', async () => {
    render(<ResetPassword />);

    await waitFor(() => {
      expect(screen.getByText(/No recovery token found/i)).toBeInTheDocument();
    });
  });

  test('detects tokens from URL and shows form', async () => {
    extractTokensFromUrl.mockReturnValue({
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token'
    });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
      expect(screen.queryByText(/No recovery token found/i)).not.toBeInTheDocument();
    });

    // Verify setSession was called with extracted tokens
    expect(supabase.auth.setSession).toHaveBeenCalledWith({
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token'
    });
  });

  test('uses existing session when available', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { 
        session: {
          access_token: 'session_access_token',
          refresh_token: 'session_refresh_token'
        }
      }
    });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
      expect(screen.queryByText(/No recovery token found/i)).not.toBeInTheDocument();
    });

    // Should not try to extract from URL if session exists
    expect(extractTokensFromUrl).not.toHaveBeenCalled();
  });

  test('handles session setting errors gracefully', async () => {
    extractTokensFromUrl.mockReturnValue({
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token'
    });

    supabase.auth.setSession.mockResolvedValue({
      error: { message: 'Invalid token' }
    });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(screen.getByText(/Authentication error: Invalid token/i)).toBeInTheDocument();
    });
  });
});