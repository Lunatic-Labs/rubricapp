// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import { Component } from 'react';
// @ts-expect-error TS(2307): Cannot find module 'universal-cookie' or its corre... Remove this comment to see the full error message
import Cookies from 'universal-cookie';
import { apiUrl } from '../../App.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { MenuItem, ListItemIcon} from '@mui/material';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/Logout' or... Remove this comment to see the full error message
import LogoutIcon from '@mui/icons-material/Logout';



class Logout extends Component {
    props: any;
    constructor(props: any) {
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
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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