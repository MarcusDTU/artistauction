import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login';

describe('Login page', () => {
  test('renders title, fields and submit', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('Sign Up tab validates fields and completes happy path', async () => {
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
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

    // Fix confirm and submit -> should switch back to Login tab
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
    // After successful signup the component sets tab to 0 (Login)
    await screen.findByRole('button', { name: /sign in/i });
  });

  test('submits form and has forgot password link to #/forgot', async () => {
    render(<Login />);

    // Submit form and expect navigation to home
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));
    await waitFor(() => expect(window.location.hash).toBe('#/home'));

    const link = screen.getByRole('link', { name: /forgot password/i });
    expect(link).toHaveAttribute('href', '#/forgot');
  });

  test('Back to Home link is present on the page container', () => {
    render(<Login />);
    const back = screen.getByRole('link', { name: /back to home/i });
    expect(back).toHaveAttribute('href', '#/home');
  });
});
