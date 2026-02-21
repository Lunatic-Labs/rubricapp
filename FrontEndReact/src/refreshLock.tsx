import { apiUrl } from './App';
import { User } from './utility';
import Cookies from 'universal-cookie';

let refreshPromise: Promise<any> | null = null;

//function sleep(ms:number){
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

/**
 * This function returns a refresh promise if there is one. The presense of a promise means that
 * there is an in flight refresh request that is still wrapping up. When undefined is returned,
 * there was some error with getting creds. It is recommended to refresh at that point.
 */
export function refreshAccessTokens(): Promise<any> | null | undefined{
    if (refreshPromise){
        console.log("in flight", refreshPromise);
        return refreshPromise;
    }
    
    const refreshTokenKey: string = "refresh_token";
    const accessTokenKey: string = "access_token";
    const userKey: string = "user"
    const cookies = new Cookies();  
    const user: User | undefined = cookies.get(userKey);
    const userId: string = user?.user_id ?? "";
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
      console.log("promise then");
      if (!res.ok){
        return undefined;
      }

      const refreshResult = await res.json();
      console.log("refresh then result", refreshResult);

      console.log("old access", cookies.get(accessTokenKey));
      console.log("old refresh", cookies.get(refreshTokenKey));

      console.log("headers", refreshResult.headers);

      cookies.set(accessTokenKey, refreshResult.headers.access_token, { sameSite: 'strict' });
      cookies.set(refreshTokenKey, refreshResult.headers.refresh_token, { sameSite: 'strict' });
      
      console.log("new access token", cookies.get(accessTokenKey));
      console.log("new refresh token", cookies.get(refreshTokenKey));
      
      return null;
    
    }).catch(err => {
      console.log("error here" ,err);
      return undefined;
    }).finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
}