import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Component] Save user credentials',
  props<{
    userId: string;
    username: string;
    accessToken: string;
    refreshToken: string;
  }>()
);
