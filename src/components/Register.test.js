import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Register from './Register';

test('renders register form', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const registerElement = screen.getByText(/register/i);
  expect(registerElement).toBeInTheDocument();
});
