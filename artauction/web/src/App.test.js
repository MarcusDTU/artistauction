import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
    window.alert.mockRestore();
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
test('renders bid input and submit button', () => {
    render(<App />);
    const input = screen.getByLabelText(/bid amount/i);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
});
test('submit valid bid', () => {
    render(<App />);
    const input = screen.getByLabelText(/bid amount/i);
    const button = screen.getByRole('button', { name: /submit/i });
    userEvent.type(input, '100');
    userEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith('Bid submitted: 100');
})



