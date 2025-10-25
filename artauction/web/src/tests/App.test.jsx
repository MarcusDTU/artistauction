import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Header with logo and Log in', () => {
  render(<App />);
  // Logo image in Header
  expect(screen.getByRole('img', { name: /art auction logo/i })).toBeInTheDocument();
  // Log in label in Header
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
});

