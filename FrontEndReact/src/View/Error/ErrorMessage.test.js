import React from 'react';
import { screen, render } from '@testing-library/react';
import {toBeInTheDocument} from '@testing-library/jest-dom'
import ErrorMessage from './ErrorMessage'; 

describe('ErrorMessage', () => {
  it('renders an error message when errorMessage is provided', () => {
    render(<ErrorMessage errorMessage="Bad"/>)

    expect(screen.getByText(/Bad/)).toBeInTheDocument();
  });
});
