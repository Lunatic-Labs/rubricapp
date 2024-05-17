import React, { Component } from 'react';

class UserAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            loggedIn: null,
            hasSetPassword: null,
            resettingPassword: null,
            email: '',
            password: '',
            showPassword:'',
        }
    }

    render() {
        const {
            isLoaded,
            password,
            showPassword,
            errors
        } = this.state;

        return (
            <>
            
            </>
        )
    }
        // const cookies = new Cookies();

        // else if(!loggedIn && (!cookies.get('access_token') && !cookies.get('refresh_token') && !cookies.get('user'))) {
        //     return(
        //         <>
        //             { isLoaded && errorMessage &&
        //                 <>
        //                     {/* A response has been received and an error occurred */}
        //                     <Box>
        //                         <ErrorMessage errorMessage={errorMessage} />
        //                     </Box>
        //                 </>
        //             }

        //             <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
        //                 <Box role="form" className="form-position">
        //                     <Box className="card-style">
        //                         <FormControl className="form-spacing">
        //                             <form aria-label='loginForm'>
        //                                 <Typography variant="h6" component="div"
        //                                     sx={{
        //                                         color: "#2E8BEF",
        //                                         fontFeatureSettings: "'clig' off, 'liga' off",
        //                                         fontFamily: "Roboto",
        //                                         fontSize: {xs:"24px", md:"30px"},
        //                                         fontStyle: "normal",
        //                                         fontWeight: "500",
        //                                         lineHeight: "160%",
        //                                         letterSpacing: "0.15px",
        //                                         textAlign:"center"
        //                                     }}
        //                                 >
        //                                     SkillBuilder
        //                                 </Typography>
            
        //                                 <Box>
        //                                     <TextField
        //                                         margin="normal"
        //                                         required
        //                                         fullWidth
        //                                         autoComplete='username'
        //                                         id="email"
        //                                         label="Email Address"
        //                                         type="text"
        //                                         name="email"
        //                                         error={!!errors.email}
        //                                         helperText={errors.email}
        //                                         value={email}
        //                                         onChange={this.handleChange}
        //                                         aria-label="emailInput"
        //                                     />

        //                                     <TextField
        //                                         margin="normal"
        //                                         required
        //                                         fullWidth
        //                                         autoComplete='current-password'
        //                                         name="password"
        //                                         label="Password"
        //                                         type={showPassword ? 'text' : 'password'}
        //                                         id="password"
        //                                         value={password}
        //                                         error={!!errors.password}
        //                                         helperText={errors.password}
        //                                         onChange={this.handleChange}
        //                                         aria-label="passwordInput"
        //                                         InputProps={{
        //                                             endAdornment: (
        //                                               <InputAdornment position="end">
        //                                                 <IconButton
        //                                                   aria-label="toggle password visibility"
        //                                                   onClick={this.handleTogglePasswordVisibility}
        //                                                   edge="end"
        //                                                 >
        //                                                   {showPassword ? <VisibilityOff /> : <Visibility />}
        //                                                 </IconButton>
        //                                               </InputAdornment>
        //                                             ),
        //                                         }}
        //                                     />

        //                                     <Grid sx={{textAlign:'right', mb:1}}>
        //                                         <Grid>
        //                                             <Link
        //                                                 href= "#"
        //                                                 sx={{color: "#2E8BEF"}}
        //                                                 onClick={this.resetPassword}
        //                                                 aria-label='resetPasswordButton'
        //                                             >
        //                                                 Forgot password?
        //                                             </Link>
        //                                         </Grid>
        //                                     </Grid>

        //                                     <Button
        //                                         onClick={this.login}
        //                                         type="button"
        //                                         fullWidth
        //                                         variant="contained"
        //                                         className='primary-color'
        //                                         sx={{ mt: 2, mb: 2 }}
        //                                         aria-label="loginButton"
        //                                     >
        //                                         Sign In
        //                                     </Button>
        //                                 </Box>
        //                             </form>
        //                         </FormControl>
        //                     </Box>
        //                 </Box>
        //             </Box>
        //         </>
        //     )
        // }

}

export default UserAccount;