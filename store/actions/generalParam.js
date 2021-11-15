//auth actions...
import {
  HOME_TO_WORK,
  WORK_TO_DETAIL,
  TIMER_DATE,
  IS_SHOW_TIMER,
  USER_OBJECT,
  ONGOING_STATUS,
  IS_ADHOC,
  ASSET_LENGTH
} from './types';

export const setHomeToWork = (category) => (
  {
    type: HOME_TO_WORK,
    payload: category
  });
export const setSelectedWorkCategoryTopBar = (category) => (
  {
    type: WORK_TO_DETAIL,
    payload: category
  });
export const setIntialTimerDate = (dateForTimer) => (
  {
    type: TIMER_DATE,
    payload: dateForTimer
  });
export const setIsShowTimer = (show) => (
  {
    type: IS_SHOW_TIMER,
    payload: show
  });
export const setUserObjectQuery = (userObject) => (
  {
    type: USER_OBJECT,
    payload: userObject
  });
export const setOngoingStatus = (status) => (
  {
    type: ONGOING_STATUS,
    payload: status
  });
export const setIsAdhoc = (adhoc) => (
  {
    type: IS_ADHOC,
    payload: adhoc
  });
export const setAssetLength = (assetLength) => (
  {
    type: ASSET_LENGTH,
    payload: assetLength
  });
