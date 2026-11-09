import { Component } from 'react';
import Cookies from 'universal-cookie';
import { apiUrl } from '../../App';
import { MenuItem, ListItemIcon} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { unsubscribeFromPushNotifications } from '../../utils/pushNotifications';

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

        // A browser's push subscription is shared across whoever logs into it,
        // not tied to one account -- without this, the next person to log in
        // on this device would see the toggle as already "on" while pushes
        // kept going to the account that originally subscribed. Needs the
        // still-valid auth cookies, so this has to run before they're cleared
        // below; failures are swallowed since logout must proceed regardless.
        unsubscribeFromPushNotifications().catch(() => {});

        fetch(
            apiUrl + `/logout?user_id=${userId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // No-op outside ngrok's free tier; skips its anti-abuse
                    // interstitial during real-device testing over a tunnel.
                    "ngrok-skip-browser-warning": "true",
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
            <MenuItem data-testid='logout-button' onClick={this.handleLogout}>
                <ListItemIcon>
                    <LogoutIcon sx={{color:"#757575"}} fontSize="small" />
                </ListItemIcon>
                Log Out
            </MenuItem>
        )
    }
}

export default Logout;