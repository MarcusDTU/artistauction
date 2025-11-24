// javascript
// File: `web/src/pages/__tests__/ArtistPortfolio.test.jsx`
import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtistPortfolio from '../pages/ArtistPortfolio';
import * as router from 'react-router-dom';

jest.mock('../components/PreviewArtworkList', () => (props) => (
  <div data-testid="preview-list">
    {props.artworks?.map((a, i) => (
      <button key={i} onClick={() => props.onSelect && props.onSelect(a)}>
        {a.title || `art-${i}`}
      </button>
    )) || null}
  </div>
));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
  };
});

describe('ArtistPortfolio', () => {
  const useParamsMock = router.useParams;
  const useLocationMock = router.useLocation;
  const useNavigateMock = router.useNavigate;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('renders artist from location.state and does not call fetch', async () => {
    const artist = {
      name: 'Test Artist',
      bio: 'Artist bio',
      artworks: [{id: 'a1', title: 'Artwork One'}]
    };

    useParamsMock.mockReturnValue({artistId: '123'});
    useLocationMock.mockReturnValue({state: {artist}});
    const navigateMock = jest.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    render(<ArtistPortfolio />);

    expect(screen.getByText(/Test Artist/)).toBeInTheDocument();
    expect(screen.getByText(/Artist bio/)).toBeInTheDocument();
    expect(screen.getByText('Artwork One')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('fetches artist when no initial state and renders result', async () => {
    const fetchedArtist = {
      name: 'Fetched Artist',
      bio: 'Fetched bio'
    };
    const fetchedArtworks = [{id: 'b1', title: 'Fetched Art', status: 'available'}];

    useParamsMock.mockReturnValue({artistId: '42'});
    useLocationMock.mockReturnValue({state: null});
    const navigateMock = jest.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const base = process.env.REACT_APP_API_BASE || 'http://localhost:8081';

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => fetchedArtist
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => fetchedArtworks
      });

    render(<ArtistPortfolio />);

    expect(screen.getByText(/Loading artist/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Fetched Artist/)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(`${base}/artist/42`);
    expect(global.fetch).toHaveBeenCalledWith(`${base}/artwork/artist/42`);
    expect(screen.getByText('Fetched Art')).toBeInTheDocument();
  });

  test('shows error when fetch fails', async () => {
    useParamsMock.mockReturnValue({artistId: '99'});
    useLocationMock.mockReturnValue({state: null});
    const navigateMock = jest.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const base = process.env.REACT_APP_API_BASE || 'http://localhost:8081';

    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        text: async () => 'internal error'
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => []
      });

    render(<ArtistPortfolio />);

    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
    // ensure fetch attempted the expected endpoints
    expect(global.fetch).toHaveBeenCalledWith(`${base}/artist/99`);
    expect(global.fetch).toHaveBeenCalledWith(`${base}/artwork/artist/99`);
  });

  test('navigates to artwork page with state when artwork selected', async () => {
    const artist = {
      name: 'Nav Artist',
      bio: 'Has bio',
      artworks: [{id: 'nav-1', title: 'Nav Art'}]
    };

    useParamsMock.mockReturnValue({artistId: 'nav'});
    useLocationMock.mockReturnValue({state: {artist}});
    const navigateMock = jest.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    render(<ArtistPortfolio />);

    const btn = screen.getByRole('button', {name: 'Nav Art'});
    await userEvent.click(btn);

    expect(navigateMock).toHaveBeenCalledWith('/artworks/nav-1', {state: {art: artist.artworks[0]}});
  });
});