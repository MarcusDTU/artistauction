import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders Login page when hash is #/login', () => {
  const oldHash = window.location.hash;
  window.location.hash = '#/login';
  render(<App />);
  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  // cleanup
  window.location.hash = oldHash;
});

test('renders Forgot Password page when hash is #/forgot', () => {
  const oldHash = window.location.hash;
  window.location.hash = '#/forgot';
  render(<App />);
  expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
  window.location.hash = oldHash;
});

