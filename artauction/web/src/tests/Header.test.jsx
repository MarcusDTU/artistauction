import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';

describe('Header', () => {
  test('renders logo image and login text', () => {
    render(<Header />);

    // Logo image by alt text
    const logoImg = screen.getByRole('img', { name: /art auction logo/i });
    expect(logoImg).toBeInTheDocument();

    // Login text
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  test('has a Home link to root', () => {
    render(<Header />);
    const home = screen.getByRole('link', { name: /home/i });
    expect(home).toHaveAttribute('href', '/');
  });

  test('clicking login triggers alert', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Header />);

    fireEvent.click(screen.getByText(/log in/i));
    expect(alertSpy).toHaveBeenCalledWith('Login functionality to be implemented');

    alertSpy.mockRestore();
  });
});
