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

    beforeEach(() => {
      // reset the mocked navigate before each test
      const rr = require('react-router-dom');
      rr.useNavigate.mockReset();
    });

    test('renders heading and a sample artwork title', () => {
        renderWithRouter(<ArtistDashboard />);
        expect(screen.getByText('Your Artworks')).toBeInTheDocument();
        // ensure at least the first sample artwork title is shown
        expect(screen.getByText(SAMPLE_ARTWORKS[0].title || SAMPLE_ARTWORKS[0].name)).toBeInTheDocument();
    });

    test('renders status for each artwork', () => {
        renderWithRouter(<ArtistDashboard />);
        const publicItems = screen.getAllByText(/public/i);
        const privateItems = screen.getAllByText(/private/i);
        // number of status items should equal number of artworks
        expect(publicItems.length + privateItems.length).toBe(SAMPLE_ARTWORKS.length);
    });

    test('Edit button calls navigate with correct path and state', () => {
        const rr = require('react-router-dom');
        const navigateMock = jest.fn();
        rr.useNavigate.mockReturnValue(navigateMock);

        renderWithRouter(<ArtistDashboard />);
        const editButtons = screen.getAllByText('Edit');
        expect(editButtons.length).toBeGreaterThan(0);

        // click the first edit button
        fireEvent.click(editButtons[0]);

        const firstId = SAMPLE_ARTWORKS[0].id;
        expect(navigateMock).toHaveBeenCalledWith(
          `/edit-artwork/${firstId}`,
          expect.objectContaining({
            state: expect.objectContaining({
              artwork: expect.objectContaining({ id: firstId })
            })
          })
        );
    });

    test('Upload button shows alert', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        renderWithRouter(<ArtistDashboard />);
        const uploadButtons = screen.getAllByLabelText('Upload new artwork');
        expect(uploadButtons.length).toBeGreaterThan(0);

        fireEvent.click(uploadButtons[0]);

        expect(alertMock).toHaveBeenCalledWith('Upload feature not implemented yet');

        alertMock.mockRestore();
    });
});