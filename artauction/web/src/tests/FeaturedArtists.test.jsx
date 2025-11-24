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
  });

  // javascript
  // Update in `web/src/tests/FeaturedArtists.test.jsx`
  test('renders three artist cards with images and names', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([
        { artist_id: '1', name: 'Artist One', image_url: 'http://example/1.jpg' },
        { artist_id: '2', name: 'Artist Two', image_url: 'http://example/2.jpg' },
        { artist_id: '3', name: 'Artist Three', image_url: 'http://example/3.jpg' },
      ]),
    });

    render(
      <MemoryRouter>
        <FeaturedArtists />
      </MemoryRouter>
    );

    const cards = await screen.findAllByTestId(/artist-/);
    expect(cards).toHaveLength(3);

    cards.forEach((card) => {
      const img = card.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img.alt).toBeTruthy();

      const nameEl = card.querySelector('.artist-name');
      expect(nameEl).toBeInTheDocument();
      expect(nameEl.textContent.trim().length).toBeGreaterThan(0);
    });

    global.fetch = originalFetch;
  });
});
