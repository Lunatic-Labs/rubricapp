import { apiUrl } from './App';
import Cookies from 'universal-cookie';

let refreshPromise: Promise<any> | null = null;

/**
 * This function returns a refresh promise if there is one. The presense of a promise means that
 * there is an in flight refresh request that is still wrapping up. When undefined is returned,
 * there was some error with getting creds. It is recommended to refresh at that point.
 */
export function refreshAccessToken(): Promise<any> | null | undefined{
    if (refreshPromise){
        return refreshPromise;
    }
    
    const refreshTokenKey: string = "refresh_token";
    const accessTokenKey: string = "access_token";
    const userKey = 'user';
    const cookies = new Cookies();  
    const userId: string | undefined = cookies.get(userKey);
    const refreshToken: string | undefined = cookies.get(refreshTokenKey);

    refreshPromise = fetch(
      `${apiUrl}/refresh?user_id=${userId}&refresh_token=${refreshToken}`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + refreshToken
        }
      }
    ).then(async res => {
      if (!res.ok){
        return undefined;
      }

      const refreshResult = await res.json();

      cookies.set(accessTokenKey, refreshResult.headers.access_token, { sameSite: 'strict' });
      cookies.set(refreshTokenKey, refreshResult.headers.refresh_token, { sameSite: 'strict' });
    
    }).catch(err => {
      return undefined;
    }).finally(() => {
      refreshPromise = null;
    });


    return refreshPromise;
}