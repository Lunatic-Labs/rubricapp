import { Component } from 'react';
import Cookies from 'universal-cookie';
import { apiUrl } from '../../App';
import { MenuItem, ListItemIcon} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutProps {
    logout: () => void;
}

class Logout extends Component<LogoutProps> {
    constructor(props: LogoutProps) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        const cookies = new Cookies();

        const accessToken = cookies.get('access_token');
        const refreshToken = cookies.get('refresh_token');
        const userId = cookies.get('user')['user_id'];

        fetch(
            apiUrl + `/logout?user_id=${userId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }),
            }
        )
        .then(res => res.json())
        .then(
            (result) => {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user');

                this.props.logout();
            },
            (error) => {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user');

                this.props.logout();
            }
        )
    }

    render() {
        return(
            <MenuItem aria-label='logoutButton' onClick={this.handleLogout}>
                <ListItemIcon>
                    <LogoutIcon sx={{color:"#757575"}} fontSize="small" />
                </ListItemIcon>
                Log Out
            </MenuItem>
        )
    }
}

export default Logout;