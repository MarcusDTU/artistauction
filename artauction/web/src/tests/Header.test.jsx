import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';
import { HashRouter } from 'react-router-dom';

describe('Header', () => {
  test('renders logo image and login text', () => {
    render(
      <HashRouter>
        <Header />
      </HashRouter>
    );

    // Logo image by alt text
    const logoImg = screen.getByRole('img', { name: /art auction logo/i });
    expect(logoImg).toBeInTheDocument();

    // Login text
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  test('has a Home link to #/home (GitHub Pages-safe)', () => {
    render(
      <HashRouter>
        <Header />
      </HashRouter>
    );
    const home = screen.getByRole('link', { name: /home/i });
    expect(home).toHaveAttribute('href', '#/home');
  });

  test('clicking login calls provided onLogin', () => {
    const onLogin = jest.fn();
    render(
      <HashRouter>
        <Header onLogin={onLogin} />
      </HashRouter>
    );

    fireEvent.click(screen.getByText(/log in/i));
    expect(onLogin).toHaveBeenCalled();
  });

  test('clicking login without handler updates hash to login', () => {
    render(
      <HashRouter>
        <Header />
      </HashRouter>
    );
    // Ensure starting state
    window.location.hash = '';
    fireEvent.click(screen.getByText(/log in/i));
    expect(window.location.hash).toBe('#/login');
  });
});
