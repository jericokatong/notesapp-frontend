import { createReducer, on } from '@ngrx/store';
import { login, logout } from './global.actions';

export interface GlobalState {
  userId: string;
  fullname: string;
  username: string;
  accessToken: string | null;
  refreshToken: string | null;
}

export const initialState: GlobalState = {
  userId: '',
  fullname: '',
  username: '',
  accessToken: null,
  refreshToken: null,
};

export const globalReducer = createReducer(
  initialState,
  on(
    login,
    (state, { userId, fullname, username, accessToken, refreshToken }) => ({
      ...state,
      userId,
      fullname,
      username,
      accessToken,
      refreshToken,
    })
  ),
  on(logout, () => ({
    userId: '',
    fullname: '',
    username: '',
    accessToken: null,
    refreshToken: null,
  }))
);
