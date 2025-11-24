// javascript
// File: `web/src/tests/ArtistDashboard.test.jsx`

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import ArtistDashboard from '../pages/ArtistDashboard';
import { SAMPLE_ARTWORKS } from '../assets/SampleArtwork';

describe('ArtistDashboard', () => {
    // filter noisy router future-flag warnings but allow other warnings
    const origWarn = console.warn;
    beforeAll(() => {
      jest.spyOn(console, 'warn').mockImplementation((...args) => {
        const msg = String(args[0] || '');
        if (msg.includes('React Router Future Flag Warning')) return;
        origWarn(...args);
      });
    });

    afterAll(() => {
      console.warn.mockRestore();
    });

    const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

    // preserve any existing global.fetch and restore after tests
    const originalFetch = global.fetch;

    beforeEach(() => {
      // reset the mocked navigate before each test
      const rr = require('react-router-dom');
      rr.useNavigate.mockReset();

      // mock fetch to return the SAMPLE_ARTWORKS for the component
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => SAMPLE_ARTWORKS
      });
    });

    afterEach(() => {
      // restore fetch to original (if any) between tests
      global.fetch = originalFetch;
      jest.resetAllMocks();
    });

    test('renders heading and a sample artwork title', async () => {
        renderWithRouter(<ArtistDashboard />);
        expect(screen.getByText('Your Artworks')).toBeInTheDocument();
        // wait for the async fetch and rendering of artwork title
        const title = SAMPLE_ARTWORKS[0].title || SAMPLE_ARTWORKS[0].name;
        expect(await screen.findByText(title)).toBeInTheDocument();
    });

    test('renders status for each artwork', async () => {
        renderWithRouter(<ArtistDashboard />);
        // wait for statuses to appear
        const publicItems = await screen.findAllByText(/public/i);
        const privateItems = await screen.findAllByText(/private/i);
        // number of status items should equal number of artworks
        expect(publicItems.length + privateItems.length).toBe(SAMPLE_ARTWORKS.length);
    });

    test('Edit button calls navigate with correct path and state', async () => {
        const rr = require('react-router-dom');
        const navigateMock = jest.fn();
        rr.useNavigate.mockReturnValue(navigateMock);

        renderWithRouter(<ArtistDashboard />);
        const editButtons = await screen.findAllByText('Edit');
        expect(editButtons.length).toBeGreaterThan(0);

        // click the first edit button
        fireEvent.click(editButtons[0]);

        const firstId = SAMPLE_ARTWORKS[0].id;
        expect(navigateMock).toHaveBeenCalledWith(
          `/edit-artwork/${firstId}`,
          expect.objectContaining({
            state: expect.objectContaining({
              artwork: expect.objectContaining({ id: String(firstId) })
            })
          })
        );
    });

    test('Upload button navigates to upload page', () => {
        const rr = require('react-router-dom');
        const navigateMock = jest.fn();
        rr.useNavigate.mockReturnValue(navigateMock);

        renderWithRouter(<ArtistDashboard />);
        const uploadButtons = screen.getAllByLabelText('Upload new artwork');
        expect(uploadButtons.length).toBeGreaterThan(0);

        fireEvent.click(uploadButtons[0]);

        expect(navigateMock).toHaveBeenCalledWith('/upload-artwork');
    });
});