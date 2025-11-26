import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login';

// Mock alert function for jsdom
global.alert = jest.fn();

describe('Login page', () => {
  afterEach(() => {
    // Clean up mocks after each test
    jest.restoreAllMocks();
    global.alert.mockClear();
    if (global.fetch && global.fetch.mockRestore) {
      global.fetch.mockRestore();
    }
  });

  test('renders title, fields and submit', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('Sign Up tab validates fields and completes happy path', async () => {
    // Mock fetch to simulate successful signup
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Account created successfully' })
    });

    render(<Login />);

    // Switch to Sign Up tab
    fireEvent.click(screen.getByRole('tab', { name: /sign up/i }));

    // Submit empty form -> should show helper texts
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    // Enter values with mismatching confirm -> should show mismatch message
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'ada@gmail.com' } }); // Use gmail domain
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

    // Fix confirm and submit -> should call the API
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
    
    // Wait for the API call to be made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signup'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('ada@gmail.com')
        })
      );
    });
    
    // Verify alert was called for successful signup
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Account created successfully'));
  });

  test('submits form and has forgot password link to #/forgot', async () => {
    // Mock fetch to simulate successful login
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Login successful', token: 'fake-token' })
    });

    render(<Login />);

    // Check forgot password link exists
    const link = screen.getByRole('link', { name: /forgot password/i });
    expect(link).toHaveAttribute('href', '#/forgot');

    // Fill in form fields first
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));
    
    // Wait for any state updates to complete
    await waitFor(() => {
      // Verify the form was processed (fetch was called)
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test('Back to Home link is present on the page container', () => {
    render(<Login />);
    const back = screen.getByRole('link', { name: /back to home/i });
    expect(back).toHaveAttribute('href', '#/home');
  });
});
