import React from 'react';
import { render } from '@testing-library/react';
import Navbar from './Navbar'; // Adjust the path accordingly


test('renders navbar', () => {
  const { getByText } = render(<Navbar />);
  const linkElement = getByText(/some text within your navbar/i); 
  // Replace 'some text within your navbar' with actual text that appears in your navbar
  expect(linkElement).toBeInTheDocument();
});