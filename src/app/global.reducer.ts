import { createReducer, on } from '@ngrx/store';
import { login } from './global.actions';

export interface GlobalState {
  userId: string;
  username: string;
  accessToken: string | null;
  refreshToken: string | null;
}

export const initialState: GlobalState = {
  userId: '',
  username: '',
  accessToken: null,
  refreshToken: null,
};

export const globalReducer = createReducer(
  initialState,
  on(login, (state, { userId, username, accessToken, refreshToken }) => ({
    ...state,
    userId,
    username,
    accessToken,
    refreshToken,
  }))
);
