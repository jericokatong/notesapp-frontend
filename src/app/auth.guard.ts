import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { GlobalState } from './global.reducer';
import { selectAccessToken } from './global.selector';
import { HttpClient } from '@angular/common/http';
import { login } from './global.actions';

export const authGuard: CanActivateFn = async (route, state) => {
  const store = inject(Store<{ global: GlobalState }>);
  const router = inject(Router);
  const http = inject(HttpClient);

  try {
    const accessToken = await firstValueFrom(store.select(selectAccessToken));

    if (accessToken) {
      return true;
    } else {
      const refreshToken: string | null = localStorage.getItem('refreshToken');
      const userId: string | null = localStorage.getItem('userId');
      if (refreshToken) {
        try {
          // Get new access token
          const authResponse: any = await firstValueFrom(
            http.put('http://localhost:3000/authentications', { refreshToken })
          );
          const newAccessToken = authResponse.data.accessToken;

          // Get user data
          const userResponse: any = await firstValueFrom(
            http.get(`http://localhost:3000/users/${userId}`)
          );

          store.dispatch(
            login({
              userId: userId!,
              fullname: userResponse.data.user.fullname,
              username: userResponse.data.user.username,
              accessToken: newAccessToken,
              refreshToken: refreshToken!,
            })
          );

          return true;
        } catch (error) {
          console.log('Error:', error);
          return false;
        }
      } else {
        router.navigate(['/login']);
        return false;
      }
    }
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};
