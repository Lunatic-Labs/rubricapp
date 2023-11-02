import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from './ErrorMessage'; 

describe('ErrorMessage', () => {
  it('renders an error message when errorMessage is provided', () => {
    const { getByText } = render(
      <ErrorMessage errorMessage=" resulted in an error" resource="Resource" />
    );

    expect(getByText(' resulted in an error')).toBeInTheDocument();
    expect(getByText(' resulted in an error')).toBeInTheDocument();
  });
});
