import { Component } from 'react';
import Cookies from 'universal-cookie';
import { unauthenticatedResourcePOST } from '../../utility';
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

        // The backend takes the tokens to blacklist from the body rather than from an
        // Authorization header, so /logout carries no @jwt_required and this belongs on the
        // unauthenticated helper. Routing it through genericResourcePOST would also let the
        // token-refresh machinery fire mid-logout, which is the last thing wanted here.
        unauthenticatedResourcePOST(
            `/logout?user_id=${encodeURIComponent(String(userId))}`,
            JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
            })
        ).catch(() => {
            // A failed blacklist call must not strand the user in a logged-in UI; the local
            // session is cleared below either way.
        }).finally(() => {
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