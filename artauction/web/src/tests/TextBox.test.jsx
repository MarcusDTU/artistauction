import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextBox from '../components/TextBox';

describe('TextBox component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders default label, placeholder and hint', () => {
    render(<TextBox />);
    expect(screen.getByText('Add title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter add title')).toBeInTheDocument();
    expect(screen.getByText('Provide a short title for your artwork')).toBeInTheDocument();
  });

  test('uses title prop and id to derive placeholder and aria-labelledby', () => {
    render(<TextBox title="Artwork Title" id="titlebox1" />);
    expect(screen.getByText('Artwork Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter artwork title')).toBeInTheDocument();

    const container = screen.getByRole('group');
    expect(container).toHaveAttribute('aria-labelledby', 'titlebox1-label');
    expect(document.getElementById('titlebox1-label')).toBeInTheDocument();
  });

  test('calls onChange and updates input value', () => {
    const onChange = jest.fn();
    render(<TextBox title="Name" onChange={onChange} />);
    const input = screen.getByLabelText('Name input');
    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(onChange).toHaveBeenCalledWith('Alice');
    expect(input.value).toBe('Alice');
  });

  test('clicking the container focuses the input', () => {
    render(<TextBox title="ClickMe" />);
    const container = screen.getByRole('group');
    const input = screen.getByLabelText('ClickMe input');

    // ensure not focused initially
    expect(document.activeElement).not.toBe(input);

    fireEvent.click(container);
    expect(document.activeElement).toBe(input);
  });

  test('does not render hint when hint prop is empty', () => {
    render(<TextBox title="NoHint" hint="" />);
    // default hint text should not be present
    expect(screen.queryByText('Provide a short title for your artwork')).not.toBeInTheDocument();
  });
});