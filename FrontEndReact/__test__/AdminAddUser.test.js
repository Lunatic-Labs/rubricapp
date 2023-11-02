import AdminAddUser from '../../../Admin/Add/AddUsers/AdminAddIser.js';
import React from 'react';
import { render, screen } from '@testing-library/react';


describe('AdminAddUser', () => {
    it('populates form fields with user data when a user is provided', () => {
      const user = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        role_id: 'admin',
        lms_id: '12345'
      };
  
      render(<AdminAddUser user={user} />);
  
      expect(screen.getByDisplayValue(user.first_name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.last_name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.role_id)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.lms_id)).toBeInTheDocument();
    });
    });
