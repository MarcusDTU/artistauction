import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturedArtists from '../components/FeaturedArtists';

describe('FeaturedArtists', () => {
  test('renders section title and subtitle', () => {
    render(<FeaturedArtists />);
    expect(screen.getByRole('heading', { name: /featured artists/i })).toBeInTheDocument();
    expect(screen.getByText(/explore the portfolios/i)).toBeInTheDocument();
  });

  test('renders three artist cards with images and names', () => {
    render(<FeaturedArtists />);
    const names = [/elena martinez/i, /james chen/i, /sophia laurent/i];
    names.forEach((name) => {
      expect(screen.getByRole('img', { name })).toBeInTheDocument();
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});

