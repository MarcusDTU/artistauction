// File: web/src/tests/ArtworkPage.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtworkPage from '../pages/ArtworkPage';
import * as router from 'react-router-dom';

jest.mock('../pages/../components/DisplayArtwork', () => () => (
  <div data-testid="display-artwork">display-artwork</div>
));

jest.mock('../pages/../components/BiddingComponent', () => (props) => (
  <div data-testid="bidding-component">
    <span>initial-bid: {props.initialBid}</span>
    <button onClick={() => props.onBidUpdate && props.onBidUpdate((props.initialBid || 0) + 50)}>
      Place bid +50
    </button>
  </div>
));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

describe('ArtworkPage', () => {
  const useNavigateMock = router.useNavigate;
  const useLocationMock = router.useLocation;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });


  test('back button calls navigate(-1) when no artist in location.state', async () => {
    const navigate = jest.fn();
    useNavigateMock.mockReturnValue(navigate);

    useLocationMock.mockReturnValue({ state: { art: { id: 'a' } } });

    render(<ArtworkPage />);

    const backBtn = screen.getByRole('button', { name: /← Back to Artist/i });
    await userEvent.click(backBtn);

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  test('passes correct initialBid to BiddingComponent from artwork starting/current bid', () => {
    useNavigateMock.mockReturnValue(jest.fn());

    // artwork has startingBid only
    useLocationMock.mockReturnValue({ state: { art: { id: 'x', startingBid: 100 } } });

    render(<ArtworkPage />);

    expect(screen.getByText(/initial-bid: 100/)).toBeInTheDocument();
  });


});