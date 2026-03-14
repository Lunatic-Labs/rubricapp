import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage';
import { Button, TextField, FormControl, Box, Typography, InputAdornment, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { apiUrl } from '../../App';
import Cookies from 'universal-cookie';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Email, AccountCircle } from '@mui/icons-material';
import { MAX_PASSWORD_LENGTH } from '../../Constants/password';

/**
 * Creates an instance of the UserAccount component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * 
 * @property {string|null} state.errorMessage - Error message displayed for password validation or API errors.
 * @property {boolean} state.isPasswordSet - Indicates whether the user successfully changed their password.
 * @property {string} state.password - The new password entered by the user.
 * @property {string} state.confirmationPassword - The confirmation password (must match `password`).
 * @property {boolean} state.showPassword - Toggles visibility of the password text field.
 * @property {Object|null} state.user - Logged-in user information loaded from cookies.
 * @property {boolean} state.resetPasswordDialogOpen - Whether the password reset modal dialog is open.
 *
 * @property {Object} state.errors - Input-specific error messages.
 * @property {string} state.errors.password - Error message for password input.
 * @property {string} state.errors.confirmationPassword - Error message for confirmation password input.
 *
 * @property {Object} state.PasswordStrength - Enum representing password strength.
 * @property {string} state.PasswordStrength.STRONG - Strong password flag.
 * @property {string} state.PasswordStrength.MEDIUM - Medium password flag.
 * @property {string} state.PasswordStrength.WEAK - Weak password flag.
 */

interface UserAccountProps {
    navbar?: any;
}

interface UserAccountState {
    errorMessage: string | null;
    isPasswordSet: boolean;
    password: string;
    confirmationPassword: string;
    showPassword: boolean;
    user: any;
    resetPasswordDialogOpen: boolean;
    isLoaded?: boolean;
    errors: {
        password: string;
        confirmationPassword: string;
    };
    PasswordStrength: {
        STRONG: string;
        MEDIUM: string;
        WEAK: string;
    };
}

class UserAccount extends Component<UserAccountProps, UserAccountState> {
    constructor(props: UserAccountProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isPasswordSet: false,
            password: '',
            confirmationPassword: '',
            showPassword: false,
            user: null,
            resetPasswordDialogOpen: false,

            errors: {
                password: '',
                confirmationPassword: ''
            },

            PasswordStrength: {
                STRONG: 'STRONG',
                MEDIUM: 'MEDIUM',
                WEAK: 'WEAK'
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleTogglePasswordVisibility = this.handleTogglePasswordVisibility.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }

    /**
     * @method handleChange - Handles updates to password or confirmation password fields while applying validation rules:
     *  - Required fields.
     *  - Maximum length not exceeding MAX_PASSWORD_LENGTH.
     * @param {*} e - the input event.
     */

    // handleChange has been altered to account for the 20 character limit for password
    handleChange(e: any) {
        const { id, value } = e.target;

        // This will create an error message if password is empty and/or exceeding the 20 character limit
        let errorMessage = '';
        if(value.trim() === '') {
            errorMessage = `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`;   // the old code from this.setState() has been re-used here
        } else if(id === 'password' && value.length > MAX_PASSWORD_LENGTH) {
            errorMessage = `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`;                          // checks if password is not exceeding 20 characters
        } else if(id === 'confirmationPassword' && value.length > MAX_PASSWORD_LENGTH) {
            errorMessage = `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`;                          // checks if confirmationPassword is not exceeding 20 characters
        }

        // this.setState() used to contain the code below.
        //
        //[id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
        //
        // part of it was moved to errrorMessage and replaced with [id]: errorMessage,
        this.setState({
            [id]: value,
            errors: {
                ...this.state.errors,
                [id]: errorMessage,
            },
        } as any);
    }


    /**
     * @method handleResetPasswordClick - Opens the password reset dialog/modal.
     */
    handleResetPasswordClick() {
        this.setState({ resetPasswordDialogOpen: true });
    }

    /**
     * @method handleDialogClose - Closes the password reset dialog and clears temporary password input values.
     */
    handleDialogClose() {
        this.setState({ resetPasswordDialogOpen: false });
    }



    /**
     * @method getIcon - Returns the appropriate password strength icon component (CheckIcon or ErrorOutlineIcon).
     * @param {enum} strength - The strength of the password.
     * @returns {import} Returns the Material UI icon component.
     */

    getIcon(strength: any) {
        switch (strength) {
            case 'STRONG':
                return CheckIcon;
            case 'WEAK':
            case 'MEDIUM':
                return ErrorOutlineIcon;
            default:
                return ErrorOutlineIcon;
        }
    }

    /**
     * @method generateColors - Returns the appropriate strength bar colors (weak / medium / strong) for UI visualization.
     * @param {enum} strength - The strength of the password.
     * @returns {string} Returns the appropriate strength bar colors.
     */

    generateColors(strength: any) {
        const COLORS = {
            NEUTRAL: '#E2E2E2',
            WEAK: '#B40314',
            MEDIUM: '#D39323',
            STRONG: '#7B927F',
        };

        switch (strength) {
            case 'STRONG':
                return [COLORS.STRONG, COLORS.STRONG, COLORS.STRONG, COLORS.STRONG];
            case 'WEAK':
                return [COLORS.WEAK, COLORS.NEUTRAL, COLORS.NEUTRAL, COLORS.NEUTRAL];
            case 'MEDIUM':
                return [COLORS.MEDIUM, COLORS.MEDIUM, COLORS.NEUTRAL, COLORS.NEUTRAL];
            default:
                return [COLORS.WEAK, COLORS.NEUTRAL, COLORS.NEUTRAL, COLORS.NEUTRAL];
        }
    }

    /**
     * @method handleTogglePasswordVisibility - Toggles whether the password field displays plain text or masked characters.
     */
    handleTogglePasswordVisibility() {
        this.setState({
            showPassword: !this.state.showPassword,
            errors: {
                ...this.state.errors,
                password: '',
            },
        });
    }

    /**
     * @method testPasswordStrength - Computes password strength using criteria including:
     *  - Minimum length.
     *  - Uppercase letters.
     *  - Lowercase letters.
     *  - Numbers.
     *  - Special characters.
     * @param {string} password - The password entered by the user.
     * @returns {string} Returns the password strength level: "STRONG", "MEDIUM", "WEAK".
     */

    testPasswordStrength(password: any) {
        const atLeastMinimumLength = (password: any) => new RegExp(/(?=.{8,})/).test(password);
        const atLeastOneUppercaseLetter = (password: any) => new RegExp(/(?=.*?[A-Z])/).test(password);
        const atLeastOneLowercaseLetter = (password: any) => new RegExp(/(?=.*?[a-z])/).test(password);
        const atLeastOneNumber = (password: any) => new RegExp(/(?=.*?[0-9])/).test(password);
        const atLeastOneSpecialChar = (password: any) => new RegExp(/(?=.*?[#?!@$%^&*-])/).test(password);

        if (!password) return 'WEAK';

        let points = 0;

        if (atLeastMinimumLength(password)) points += 1;
        if (atLeastOneUppercaseLetter(password)) points += 1;
        if (atLeastOneLowercaseLetter(password)) points += 1;
        if (atLeastOneNumber(password)) points += 1;
        if (atLeastOneSpecialChar(password)) points += 1;

        if (points >= 5) return 'STRONG';
        if (points >= 3) return 'MEDIUM';

        return 'WEAK';
    }

     /**
     * @method setPassword - Validates user input and submits the new password to the backend via a PUT request, performs the following checks:
     *  - Password cannot be empty.
     *  - Confirmation password cannot be empty.
     *  - Password fields cannot exceed MAX_PASSWORD_LENGTH.
     *  - Passwords must match.
     *  - Password must be STRONG.
     * 
     * On successful API submission, transitions the component to show the Login page.
     */

    // 2 new 'validation' / error handling statements were added below
    // both check that character length does not exceed 20
    setPassword() {
        const cookies = new Cookies();
        const user = cookies.get('user');
        var pass1 = this.state.password;
        var pass2 = this.state.confirmationPassword;

        if (pass1 === '') {
            this.setState({
                errorMessage: "Password cannot be empty"
            });

            return;
        }

        if (pass2 === '') {
            this.setState({
                errorMessage: "Confirm Password cannot be empty"
            });

            return;
        }

        // this is an error check to see if password is not exceeding MAX_PASSWORD_LENGTH characters
        if (pass1.length > MAX_PASSWORD_LENGTH) {
            this.setState({
                errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
            });

            return;
        }

        // this is an error check to see if confirmationPassword is not exceeding 20 characters
        if (pass2.length > MAX_PASSWORD_LENGTH) {
            this.setState({
                errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
            });

            return;
        }

        if (pass1 !== pass2) {
            this.setState(() => ({
                errorMessage: "Passwords do not match",

                errors: {
                    password: "Passwords do not match",
                    confirmationPassword: "Passwords do not match"
                }
            }));

            return;
        }

        if (this.testPasswordStrength(pass1) !== "STRONG") {
            this.setState(() => ({
                errorMessage: "Please verify your password strength"
            }));

            return;
        }

        fetch(
            apiUrl + "/password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    password: pass1,
                }),
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    if (result['success']) {
                        this.setState({
                            resetPasswordDialogOpen: false

                        });
                    } else {
                        this.setState({
                            errorMessage: result['message']
                        });
                    }
                }
            )
            .catch(
                (error) => {
                    this.setState({
                        errorMessage: error
                    });
                }
            );
    }

    /**
     * @method componentDidMount - Loads the logged-in user from cookies and populates `state.user`.
     */
    componentDidMount() {
        const cookies = new Cookies();
        const user = cookies.get('user');

        if (user) {
            this.setState({
                isLoaded: true,
                user: user
            });
        } else {
            this.setState({
                isLoaded: true,
                errorMessage: 'User not found'
            });
        }
    }

    render() {
        const {
            errorMessage,
            isPasswordSet,
            password,
            confirmationPassword,
            errors,
            resetPasswordDialogOpen,
            user,
            showPassword
        } = this.state;

        const passwordStrength = this.testPasswordStrength(password);
        const colors = this.generateColors(passwordStrength);
        const Icon = this.getIcon(passwordStrength);

        if (!isPasswordSet) {
            return (
                <>
                   

                    <Box className="content-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="MyAccount">My Account</Typography>
                    </Box>
                    {user && (
                        <Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <AccountCircle fontSize="large" />
                                <Typography variant="h6" ml={1}>Name: {user.user_name}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Email fontSize="large" />
                                <Typography variant="h6" ml={1}>Email: {user.email}</Typography>
                            </Box>
                            <Box>
                                <Button variant="contained" color="primary" onClick={this.handleResetPasswordClick}>
                                    Reset Password
                                </Button>
                            </Box>
                            
                        </Box>
                    )}
                    <Box>
                        <Dialog maxWidth="sm" 
                            fullWidth
                            open={resetPasswordDialogOpen}
                            onClose={this.handleDialogClose}
                            PaperProps={{
                                className: 'textarea-colors',
                                sx: {
                                    backgroundColor: 'var(--dropdown-bg)',
                                    color: 'var(--textarea-color)',
                                }
                            }}
                        >
                        {errorMessage &&
                      
                            <ErrorMessage errorMessage={errorMessage} />
                       
                        }
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogContent>
                            <FormControl sx={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                    <form aria-label="setNewPasswordFormLabel">
                                        <Box>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoFocus
                                                autoComplete="new-password"
                                                name="password"
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                value={password}
                                                error={!!errors.password}
                                                helperText={errors.password}
                                                onChange={this.handleChange}
                                                inputProps={{ maxLength: MAX_PASSWORD_LENGTH + 1 }}      // the maximum character length of password has been changed to MAX_PASSWORD_LENGTH, this accounts for browsers handling characters differently
                                                aria-label="setNewPasswordInput"
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        color: 'var(--text-color)',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: errors.password ? 'var(--error-color)' : 'var(--text-color-secondary)',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: 'var(--text-color-secondary)',
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'var(--border-color)',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'var(--border-hover-color)',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#2E8BEF',
                                                        },
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        color: 'var(--error-color)',
                                                    },
                                                    '& .MuiIconButton-root': {
                                                        color: 'var(--icon-color)',
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: 'var(--icon-color)',
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={this.handleTogglePasswordVisibility}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />

                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", margin: "10px 0" }}>
                                                {colors.map((color, index) => (
                                                    <Box key={index} bgcolor={color} sx={{ flex: 1, height: "5px", borderRadius: "5px" }}></Box>
                                                ))}
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "5px", margin: "0 0 15px 0" }}>
                                                <Icon style={{ color: colors[0] }} />

                                                <Typography color={colors[0]}>{passwordStrength}</Typography>
                                            </Box>

                                            {passwordStrength !== "STRONG" && (
                                                <>
                                                    <Typography variant='subtitle2' fontSize="1rem" color="#9E9E9E" margin="0 0 8px 0">
                                                        To make your Password Stronger:
                                                    </Typography>

                                                    <Typography variant='subtitle2' fontSize="14px" color="#9E9E9E" margin="0 0 8px 0">
                                                        * Set a password with a minimum of eight characters. <br></br>
                                                        * Include a UpperCase letter. <br></br>
                                                        * Include at least One Number. <br></br>
                                                        * Include a Symbol ( ! @ # $ % ^ & *).
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <TextField
                                            sx={{ 
                                                mb: 3, 
                                                mt: 2,
                                                '& .MuiInputBase-input': {
                                                    color: 'var(--text-color)',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: errors.confirmationPassword ? 'var(--error-color)' : 'var(--text-color-secondary)',
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: 'var(--text-color-secondary)',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'var(--border-color)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'var(--border-hover-color)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#2E8BEF',
                                                    },
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    color: 'var(--error-color)',
                                                },
                                            }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="confirmationPassword"
                                            label="Retype Password"
                                            type="password"
                                            id="confirmationPassword"
                                            value={confirmationPassword}
                                            error={!!errors.confirmationPassword}
                                            helperText={errors.confirmationPassword}
                                            onChange={this.handleChange}
                                            inputProps={{ maxLength: MAX_PASSWORD_LENGTH + 1 }}          // the maximum character length of confirmationPassword has been changed to MAX_PASSWORD_LENGTH, this accounts for browsers handling characters differently
                                            aria-label="setNewPasswordConfirmInput"
                                        />

                                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                            <Box>
                                                <Button
                                                    onClick={this.setPassword}
                                                    type="button"
                                                    variant="contained"
                                                    className="primary-color"
                                                    aria-label="setNewPasswordButton"
                                                >
                                                    Set Password
                                                </Button>
                                            </Box>
                                        </Box>
                                    </form>
                                </FormControl>
                            </DialogContent>
                        </Dialog>
                    </Box>
                </>
            )
        } 
    }
}

export default UserAccount;
