import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; 
import Home from './Home';

test('renders welcome message', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  const welcomeElement = screen.getByText(/welcome to chat application/i);
  expect(welcomeElement).toBeInTheDocument();
});
