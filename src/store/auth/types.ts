/**
 * Module state
 */
export interface IAuthState {
  token: string;
  status: IAuthStatus;
  username: string;
  id: string;
}

/**
 * User data
 */
export interface IAuthData {
  username: string;
  password: string;
}

/**
 * Success server response
 */
export interface ISuccessAuthData {
  username: string;
  token: string;
  id: string;
}

/**
 * Auth statuses
 */
export interface IAuthStatus {
  state: boolean;
  message: string;
}
