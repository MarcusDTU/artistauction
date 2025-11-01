import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from '../pages/ForgotPassword';

describe('ForgotPassword page', () => {
  test('renders heading, email and submit', () => {
    render(<ForgotPassword />);
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  test('back to login navigates via hash', () => {
    const old = window.location.hash;
    render(<ForgotPassword />);
    fireEvent.click(screen.getByRole('button', { name: /back to login/i }));
    expect(window.location.hash).toBe('#/login');
    window.location.hash = old;
  });
});

