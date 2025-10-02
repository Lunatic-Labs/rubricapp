import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Typography, Button} from '@mui/material';
import Cookies from 'universal-cookie';

// all 'mode' related things are for testing and should be removed afterwards.
class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            isLoaded: false,
            isModeActive: false
        };

        this.handleToggleMode = this.handleToggleMode.bind(this);
    }

    componentDidMount() {
        const cookies = new Cookies();
        const user = cookies.get('user');

        const savedMode = localStorage.getItem('mode') === 'true';

        if (savedMode) {
            document.body.classList.add('mode');
        }

        if (user) {
            this.setState({
                isLoaded: true,
                user: user,
                isModeActive: savedMode
            });
        } else {
            this.setState({
                isLoaded: true,
                isModeActive: savedMode
            });
        }
    }

    handleToggleMode() {
        const newMode = !this.state.isModeActive;
        
        this.setState({
            isModeActive: newMode
        });

        // Toggle dark mode class on body
        if (newMode) {
            document.body.classList.add('mode');
            localStorage.setItem('mode', 'true');
        } else {
            document.body.classList.remove('mode');
            localStorage.setItem('mode', 'false');
        }
    }

    // add a field to the user table to store weather or not 'dark mode' is enabled.
    render() {
        const { user } = this.state;

        return (
            <>
                <Box className="content-spacing">
                <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="Settings">Settings</Typography>
                </Box>
                {user && (
                    <Box>
                        <Typography variant="body1" color="text.secondary">
                            Settings content will be added here.
                        </Typography>
                        <Box>
                            <Button variant="contained" className="primary-color" onClick={this.handleToggleMode}>
                                Mode
                            </Button>
                        </Box>
                    </Box>
                )}
            </>
        );
    }
}

export default Settings;