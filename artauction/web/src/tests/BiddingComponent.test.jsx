// web/src/tests/BiddingComponent.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BiddingComponent from '../components/BiddingComponent';

describe('BiddingComponent', () => {
  test('renders initial bid and Add button is disabled when input is empty', () => {
    render(<BiddingComponent initialBid={10} />);
    expect(screen.getByText(/current bid: \$10.00/i)).toBeInTheDocument();
    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeDisabled();
  });

  test('entering a positive number enables Add, clicking increments bid, clears input and calls onBidUpdate', () => {
    const onBidUpdate = jest.fn();
    render(<BiddingComponent initialBid={10} onBidUpdate={onBidUpdate} />);

    const input = screen.getByLabelText(/Increment amount/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '5.25' } });
    expect(addButton).toBeEnabled();

    fireEvent.click(addButton);

    expect(screen.getByText(/current bid: \$15.25/i)).toBeInTheDocument();
    expect(onBidUpdate).toHaveBeenCalledWith(15.25);
    expect(input.value).toBe('');
  });

  test('adds with correct rounding for floating values', () => {
    const onBidUpdate = jest.fn();
    render(<BiddingComponent initialBid={0.1} onBidUpdate={onBidUpdate} />);

    const input = screen.getByLabelText(/Increment amount/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '0.2' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/current bid: \$0.30/i)).toBeInTheDocument();
    expect(onBidUpdate).toHaveBeenCalledWith(0.3);
  });

  test('invalid (non\-positive) input keeps Add disabled and does not show error message', () => {
    render(<BiddingComponent />);
    const input = screen.getByLabelText(/Increment amount/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '-5' } });
    expect(addButton).toBeDisabled();
    expect(screen.queryByText(/Enter a positive number/i)).not.toBeInTheDocument();
  });
});