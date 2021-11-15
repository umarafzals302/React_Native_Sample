import * as types from '../actions/types'

const INITIAL_STATE = {
    currentUser: null,
    isSignedIn: false,
    authToken: null,
    notifcationCount:0,
    fcmToken:''
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.LOGOUT:
            return INITIAL_STATE;
        case types.LOGIN_RESPONSE || types.SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isSignedIn: true,
                authToken: action.payload.token
            };
        case types.SET_FCM :
            return {
                ...state,
                fcmToken: action.payload
            };
        case types.SET_AUTH_TOKEN :
            return {
                ...state,
                authToken: action.payload
            };
        case types.FORGOT_RESPONSE :
            return {
                ...state,
                forgotDetail: action.payload
            };
        case types.NOTIFICATION_COUNT :
            return {
                ...state,
                notifcationCount: action.payload
            };
        default:
            return state;
    }
}