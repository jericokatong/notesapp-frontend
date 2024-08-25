import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Component] Save user credentials',
  props<{
    userId: string;
    fullname: string;
    username: string;
    accessToken: string;
    refreshToken: string;
  }>()
);

export const logout = createAction(
  '[Header <logout button> Component] Delete user credentials'
);
