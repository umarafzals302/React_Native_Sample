import { postRequest, getRequest } from '../index';

export const loginAPI = (payload) =>
    postRequest(`/auth/login`, payload);

export const forgotAPI = (payload) =>
    postRequest(`/auth/resetPassword`, payload);

export const getAllCitiesAPI = () =>
    getRequest(`/allCities`);