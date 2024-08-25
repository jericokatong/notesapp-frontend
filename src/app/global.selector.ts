import { createSelector } from '@ngrx/store';
import { GlobalState } from './global.reducer';

interface State {
  global: GlobalState;
}

export const selectState = (state: State) => state.global;

export const selectAccessToken = createSelector(
  selectState,
  (state) => state.accessToken
);

export const selectFullname = createSelector(
  selectState,
  (state) => state.fullname
);
