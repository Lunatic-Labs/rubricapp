import AdminAddUser from '../../../Admin/Add/AddUsers/AdminAddIser.js';
import React from 'react';
import { render, screen } from '@testing-library/react';

  const AdminAddUser = {
    errorMessage: null,
    validMessage: "",
    editUser: false
  };
  
  test('renders AdminAddUser and checks initial state and render', () => {
    expect(AdminAddUser).ToHaveProperty(validMessages)
    if(this.props.user!==null){
      expect(editUser).ToHaveProperty(true);
    }
  const { getByText, queryByText } = render(<AdminAddUser {...mockProps} />);

  // Check if initial elements are rendered
  const addButton = getByText(/Add User/i);
  expect(addButton).toBeInTheDocument();

  // Check for absence of error messages initially
  const errorMessage = queryByText(/Invalid Form:/i);
  expect(errorMessage).not.toBeInTheDocument();

  const invalid_email = document.getElementById("email").value===null;
  expect(addButton)
  // More detailed checks can be added depending on what the initial state should render
  // e.g., checking if certain fields are empty, buttons are enabled/disabled, etc.

  // Optionally, simulate some events and check state changes
  // For example, simulate a button click and check for state change
  // fireEvent.click(addButton);
  // expect(...) // Assertions after state change
});

    this.props.user = {
      first_name : "John",
      last_name : "Doe",
      email : "john@example.com",
    }
    describe('AdminAddUser', () => {
      test('when all values are valid/invalid', () => {
        if(message==="Invalid Form: "){
          expect(result["success"]).toBe(true);
        }
        else{
          expect(errorMessage).toNotBe(null);
        }
      });
    });
    it('populates form fields with user data when a user is provided', () => {

      this.props.user["first_name"],
      validator(document.getElementById("lastName").value) ='Doe',
      validator(document.getElementById("email").value) = 'john@example.com',
        document.getElementById("role_id").value = 'admin',
        document.getElementById("password").value = '12345'

  
      render(<AdminAddUser user={user} />);
  
      expect(screen.getByDisplayValue(user.first_name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.last_name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.role_id)).toBeInTheDocument();
      expect(screen.getByDisplayValue(user.lms_id)).toBeInTheDocument();
      expect(errorMessage.toBe(null))
});
