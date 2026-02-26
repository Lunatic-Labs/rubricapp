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
        const cookies: Cookies = new Cookies();

        const accessToken : string|undefined = cookies.get('access_token');
        const refreshToken: string|undefined = cookies.get('refresh_token');
        const userId: number|undefined = cookies.get('user')?.['user_id'] ?? undefined;

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
        ).finally(() => {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user');

            this.props.logout();
        });
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