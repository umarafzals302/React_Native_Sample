//auth actions...
import {
  LOGOUT,
  SET_USER,
  LOGIN_RESPONSE,
  FORGOT_RESPONSE,
  NOTIFICATION_COUNT,
  SET_FCM,
  SET_AUTH_TOKEN
} from './types';

export const onLoginResponse = (payload) => ({
  type: LOGIN_RESPONSE,
  payload
});
export const setFcm = (payload) => ({
  type: SET_FCM,
  payload
});
export const setAuthToken = (payload) => ({
  type: SET_AUTH_TOKEN,
  payload
});
export const onForgotResponse = (payload) => ({
  type: FORGOT_RESPONSE,
  payload
});

export const setUser = (currentUser) => ({
  type: SET_USER,
  payload: currentUser
});


export const notificationCount = (counter) => ({
  type: NOTIFICATION_COUNT,
  payload: counter
});

export const logoutUser = () => ({
  type: LOGOUT
})


