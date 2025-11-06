import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberBox from '../components/NumberBox';

describe('NumberBox component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders default label, placeholder and hint', () => {
    render(<NumberBox />);
    expect(screen.getByText('Add number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter add number')).toBeInTheDocument();
    expect(screen.getByText('Enter a positive number')).toBeInTheDocument();
  });

  test('accepts positive floats (including leading dot) and calls onChange with numbers', () => {
    const onChange = jest.fn();
    render(<NumberBox title="Price" onChange={onChange} />);

    const input = screen.getByLabelText('Price input');

    // standard float
    fireEvent.change(input, { target: { value: '12.34' } });
    expect(input.value).toBe('12.34');
    expect(onChange).toHaveBeenCalledWith(12.34);

    onChange.mockClear();

    // leading dot -> parsed as 0.5
    fireEvent.change(input, { target: { value: '.5' } });
    expect(input.value).toBe('.5');
    expect(onChange).toHaveBeenCalledWith(0.5);
  });

  test('emptying the input calls onChange with null', () => {
    const onChange = jest.fn();
    render(<NumberBox title="Amount" value={5} onChange={onChange} />);

    const input = screen.getByLabelText('Amount input');
    expect(input.value).toBe('5');

    fireEvent.change(input, { target: { value: '' } });
    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledWith(null);
  });

  test('rejects negative and other invalid input (state and onChange not updated)', () => {
    const onChange = jest.fn();
    render(<NumberBox title="Qty" onChange={onChange} />);

    const input = screen.getByLabelText('Qty input');

    // negative number should be ignored
    fireEvent.change(input, { target: { value: '-3' } });
    expect(input.value).toBe('');
    expect(onChange).not.toHaveBeenCalled();

    // scientific notation / exponent should be ignored
    fireEvent.change(input, { target: { value: '1e3' } });
    expect(input.value).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('clicking the container focuses the input', () => {
    render(<NumberBox title="FocusMe" />);
    const container = screen.getByRole('group');
    const input = screen.getByLabelText('FocusMe input');

    expect(document.activeElement).not.toBe(input);
    fireEvent.click(container);
    expect(document.activeElement).toBe(input);
  });
});