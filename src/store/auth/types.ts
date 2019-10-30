/**
 * Module state
 */
export type AuthState = {
  token: string;
  status: AuthStatus;
  username: string;
  id: string;
};

/**
 * User data
 */
export type AuthData = {
  username: string;
  password: string;
};

/**
 * Success server response
 */
export type SuccessAuthData = {
  username: string;
  token: string;
  id: string;
};

/**
 * Auth statuses
 */
export type AuthStatus = {
  state: boolean,
  message: string,
}


