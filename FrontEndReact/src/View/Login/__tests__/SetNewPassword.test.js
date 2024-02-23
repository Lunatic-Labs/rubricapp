import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SetNewPassword from '../SetNewPassword.js';



var snp = 'setNewPasswordTitle';

test('SetNewPassword.test.js Test 1: should render SetNewPassword Form component', () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snp)).toBeInTheDocument();
});