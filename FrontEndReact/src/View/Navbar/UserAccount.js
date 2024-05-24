import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage.js';
import { Button, TextField, FormControl, Box, Typography, InputAdornment, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { apiUrl } from '../../App.js';
import Cookies from 'universal-cookie';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Email, AccountCircle } from '@mui/icons-material';

class UserAccount extends Component {
    constructor(props) {
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

    handleChange(e) {
        const { id, value } = e.target;

        this.setState({
            [id]: value,
            errors: {
                ...this.state.errors,
                [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
            },
        });
    };

    
    handleResetPasswordClick() {
        this.setState({ resetPasswordDialogOpen: true });
    }

    handleDialogClose() {
        this.setState({ resetPasswordDialogOpen: false, newPassword: '', confirmPassword: '' });
    }




    getIcon(strength) {
        switch (strength) {
            case 'STRONG':
                return CheckIcon;
            case 'WEAK':
            case 'MEDIUM':
                return ErrorOutlineIcon;
            default:
                return ErrorOutlineIcon;
        }
    };

    generateColors(strength) {
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
    };

    handleTogglePasswordVisibility() {
        this.setState({
            showPassword: !this.state.showPassword,
            errors: {
                ...this.state.errors,
                password: '',
            },
        });
    };

    testPasswordStrength(password) {
        const atLeastMinimumLength = (password) => new RegExp(/(?=.{8,})/).test(password);
        const atLeastOneUppercaseLetter = (password) => new RegExp(/(?=.*?[A-Z])/).test(password);
        const atLeastOneLowercaseLetter = (password) => new RegExp(/(?=.*?[a-z])/).test(password);
        const atLeastOneNumber = (password) => new RegExp(/(?=.*?[0-9])/).test(password);
        const atLeastOneSpecialChar = (password) => new RegExp(/(?=.*?[#?!@$%^&*-])/).test(password);

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
    };

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
            apiUrl + `/password?email=${user.email}&password=${pass1}`,
            { method: 'PUT' }
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

    componentDidMount() {
        const cookies = new Cookies();
        const user = cookies.get('user');
        console.log(user)

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
                        <Dialog maxWidth="sm" fullWidth  open={resetPasswordDialogOpen} onClose={this.handleDialogClose}>
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
                                                aria-label="setNewPasswordInput"
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
                                            sx={{ mb: 3, mt: 2 }}
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
