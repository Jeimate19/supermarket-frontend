import { render, screen } from '@testing-library/react';
import App from './App';

test('renders supermarket application navigation bar', () => {
  render(<App />);
  const brandElement = screen.getByText(/MarketSoft/i);
  expect(brandElement).toBeInTheDocument();
});