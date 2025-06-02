export enum CloseState {
  EXITED = 'EXITED',
  BACKDROP_DISMISS = 'BACKDROP_DISMISS',
  CLOSE_BUTTON = 'CLOSE_BUTTON',
  ESCAPE = 'ESCAPE',
  SUBMITTED = 'SUBMITTED',
  CANCELLED = 'CANCELLED',
}

export interface CloseResult<T = any> {
  state: CloseState;
  data?: T;
}
