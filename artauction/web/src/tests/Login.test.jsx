import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  test('submits form and triggers forgot password click', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Login />);

    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));

    // Click forgot password
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  test('contact support link renders and is clickable', () => {
    render(<Login />);
    const link = screen.getByRole('link', { name: /contact support/i });
    expect(link).toBeInTheDocument();
    // Click to exercise onClick preventDefault handler
    link.click();
  });
});
