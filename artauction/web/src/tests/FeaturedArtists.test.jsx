// web/src/tests/FeaturedArtists.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import FeaturedArtists from '../components/FeaturedArtists';

describe('FeaturedArtists', () => {
  test('renders section title and subtitle', () => {
    render(
      <MemoryRouter>
        <FeaturedArtists />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /featured artists/i })).toBeInTheDocument();
    expect(screen.getByText(/explore the portfolios/i)).toBeInTheDocument();
  });

  test('renders three artist cards with images and names', () => {
    render(
      <MemoryRouter>
        <FeaturedArtists />
      </MemoryRouter>
    );
    const names = [/elena martinez/i, /james chen/i, /sophia laurent/i];
    names.forEach((name) => {
      expect(screen.getByRole('img', { name })).toBeInTheDocument();
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});