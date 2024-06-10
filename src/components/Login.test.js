import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from './Login';

test('renders login form', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});
