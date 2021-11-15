import * as types from '../actions/types'

const INITIAL_STATE = {
    category: '',
    selectedWorkCategoryTopBar:'',
    timerIntialValue:null,
    isShowTimer:true,
    userObjectQuery:null,
    ongoingStatus:'',
    isAdhoc:true,
    assetLength:0
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.HOME_TO_WORK:
            return {
                ...state,
                category: action.payload,
            };
        case types.WORK_TO_DETAIL:
            return {
                ...state,
                selectedWorkCategoryTopBar: action.payload,
            };
        case types.TIMER_DATE:
            return {
                ...state,
                timerIntialValue: action.payload,
            };
        case types.IS_SHOW_TIMER:
            return {
                ...state,
                isShowTimer: action.payload,
            };
        case types.USER_OBJECT:
            return {
                ...state,
                userObjectQuery: action.payload,
            };
        case types.ONGOING_STATUS:
            return {
                ...state,
                ongoingStatus: action.payload,
            };
        case types.IS_ADHOC:
            return {
                ...state,
                isAdhoc: action.payload,
            };
        case types.ASSET_LENGTH:
            return {
                ...state,
                assetLength: action.payload,
            };
        default:
            return state;
    }
}