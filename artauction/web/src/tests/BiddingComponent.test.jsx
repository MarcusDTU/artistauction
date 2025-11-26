// javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BiddingComponent from '../components/BiddingComponent';

describe('BiddingComponent', () => {
  beforeEach(() => {
    // Mock localStorage to simulate logged in buyer
    const localStorageMock = {
      getItem: jest.fn((key) => {
        if (key === 'access_token') return 'fake-token';
        if (key === 'role') return 'buyer'; // Correct key name
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('renders highest bid and Bid button is present and enabled', () => {
    render(<BiddingComponent initialBid={10} />);
    // the numeric value is rendered by the component without a dollar sign
    expect(screen.getByText('10.00')).toBeInTheDocument();

    const bidButton = screen.getByRole('button', { name: /bid/i });
    expect(bidButton).toBeEnabled();
  });

  test('entering a higher bid and submitting updates highest, clears input and calls onBidUpdate', async () => {
    const onBidUpdate = jest.fn();
    render(<BiddingComponent initialBid={10} onBidUpdate={onBidUpdate} />);

    const input = screen.getByLabelText(/bid amount/i);
    const bidButton = screen.getByRole('button', { name: /bid/i });

    // enter the full bid amount (component expects the full bid, not an increment)
    fireEvent.change(input, { target: { value: '15.25' } });
    expect(input.value).toBe('15.25');

    fireEvent.click(bidButton);

    await waitFor(() => expect(screen.getByText('15.25')).toBeInTheDocument());
    expect(onBidUpdate).toHaveBeenCalledWith(15.25);
    expect(input.value).toBe('');
  });


  test('negative input sets an error message', () => {
    render(<BiddingComponent initialBid={0} />);

    const input = screen.getByLabelText(/bid amount/i);
    const bidButton = screen.getByRole('button', { name: /bid/i });

    fireEvent.change(input, { target: { value: '-5' } });
    // the component sets an error immediately on change for negative values
    expect(screen.getByText(/Bid must be 0 or greater/i)).toBeInTheDocument();
    // button remains present (component does not disable on negative input)
    expect(bidButton).toBeEnabled();
  });
});