import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Pressable,
    Modal
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from 'moment'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useIsFocused } from '@react-navigation/native'

import { useSelector, useDispatch } from "react-redux";
import { setIntialTimerDate, setOngoingStatus,setIsAdhoc,setAssetLength } from '../../../store/actions/generalParam'
import Loader from "../../../components/Loader";
import InputField from "./../../../components/FloatingLabelInputField";

import { styles } from "./Styles";
import fonts from "../../../assets/fonts";
import colors from "../../../utils/colors";
import Header from '../../../components/Header'
import strings from './../../../locales/en.json'
import icons from './../../../assets/icons/'
import Button from './../../../components/Button'

//screens
import DetailTab from './../DetailWorkTopBar/'
import AssetTab from './../AssetListWorkTopBar'
import ReportTab from './../ReportWorkTopBar'
import AttachmentTab from './../AttachmentWorkTopBar'
import HistoryTab from './../HistoryWorkTopBar'
import CommentTab from './../CommentWorkTopBar'
import { set } from "react-native-reanimated";

const TopTab = createMaterialTopTabNavigator();

const MyTopTabs = (props) => {

    useEffect(() => {
        console.log('is focus tobar->>', props.screenRefresh)
    }, [])
    return (
        <TopTab.Navigator
            headerMode={'none'}
            lazy={true}
            backBehavior="initialRoute"
            tabBarOptions={{
                scrollEnabled: true,
                activeTintColor: colors.green,
                indicatorStyle: { backgroundColor: colors.green },
                style: { backgroundColor: colors.lightGrey },
                tabStyle: {
                    width: 'auto',
                    paddingHorizontal: 10,
                    margin: 0
                },
                labelStyle: {
                    fontSize: 12,
                    fontFamily: fonts.Regular,
                    color: colors.black,
                },
            }}>
            <TopTab.Screen
                name={strings.work_tab_container.detail}
                // component={DetailTab}
                children={(_props) => <DetailTab {..._props} screenRefresh={props.screenRefresh} />}
            />
            <TopTab.Screen
                name={strings.work_tab_container.asset_list}
                // component={AssetTab}
                children={(_props) => <AssetTab {..._props} screenRefresh={props.screenRefresh} />}
            />
            <TopTab.Screen
                name={strings.work_tab_container.report}
                // component={ReportTab}
                children={(_props) => <ReportTab {..._props} screenRefresh={props.screenRefresh} />}
            />
            <TopTab.Screen
                name={strings.work_tab_container.attachment}
                // component={AttachmentTab}
                children={(_props) => <AttachmentTab {..._props} screenRefresh={props.screenRefresh} />}
            />
            <TopTab.Screen
                name={strings.work_tab_container.history}
                // component={HistoryTab}
                children={(_props) => <HistoryTab {..._props} screenRefresh={props.screenRefresh} />}
            />
            <TopTab.Screen
                name={strings.work_tab_container.comment}
                children={(_props) => <CommentTab {..._props} screenRefresh={props.screenRefresh} />}
            />
        </TopTab.Navigator>
    );
}
const TASK_TIMER_FOR_USER = gql`query taskTimerForUser($id: ID!) {
    task(id: $id) {
      id
      timer {
        timeSpent
        onGoing
        __typename
      }
      __typename
    }
  }`
const START_WORK = gql`
mutation taskStart($id: ID!) {
    taskStart(id: $id) {
      id
      status
      timer {
        timeSpent
        onGoing
      }
    }
  }
`
const PAUSE_WORK = gql`
mutation taskTimerPause($id: ID!) {
    taskTimerPause(id: $id) {
      id
      timer {
        timeSpent
        onGoing
      }
    }
  }
`
const RESUME_WORK = gql`
mutation taskTimerResume($id: ID!) {
    taskTimerResume(id: $id) {
      id
      timer {
        timeSpent
        onGoing
      }
    }
  }
`
const COMPLETE_WORK = gql`
mutation taskComplete($id: ID!) {
    taskComplete(id: $id) {
      id
      status
      timer {
        timeSpent
        onGoing
      }
    }
  }  
`
const TASK_SUBMIT = gql`
mutation taskSubmitSuppInfo($id: ID!) {
    taskSubmitSuppInfo(id: $id) {
      id
      status
    }
  }
`
const REJECT_TASK = gql`mutation taskResponsibleReject($taskId: ID!, $comment: String!) {
    taskResponsibleReject(taskId: $taskId, comment: $comment) {
      id
      status
      comments {
        ...taskCommentFields
      }
    }
  }
  fragment taskCommentFields on TaskComment {
    id
    message
    createdAt
    archived
    author {
      id
      name
      companyName
      picture {
        id
        srcUrl
      }
    }
  }
`
const ACCEPT_TASK = gql`mutation taskResponsibleAccept($taskId: ID!, $comment: String) {
    taskResponsibleAccept(taskId: $taskId, comment: $comment) {
      id
      status
      comments {
        ...taskCommentFields
      }
    }
  }
  fragment taskCommentFields on TaskComment {
    id
    message
    createdAt
    archived
    author {
      id
      name
      companyName
      picture {
        id
        srcUrl
      }
    }
  }`
const TASK_ASSETS = gql`
  query taskAssets($id: ID!) {
    task(id: $id) {
      id
      type
      adhoc
      assets {
        id
        status
        compliant
        asset {
          id
          name
          type
          system {
            id
            name
            type
            __typename
          }
          drawings {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

const WorkTopBarContainer = (props) => {
    // let timer
    let timerIntialValueTemp = 0
    const { navigation } = props
    const focus = useIsFocused()
    const { selectedWorkCategoryTopBar, isShowTimer,isAdhoc,assetLength } = useSelector((state) => state.generalParam)
    const dispatch = useDispatch()
    const [screensRefresher, setScreenRefresher] = useState(0)
    const [isApprove, setIsApprove] = useState(null)
    const [rejected, setRejected] = useState(null)
    const [loading, setLoading] = useState(false);
    const [isPlay, setIsPlay] = useState(false)

    const [timerIntialValue, setTimerIntialValue] = useState(null)
    const [dateHour, setHourDate] = useState('0h 0m 0s')
    const [counter, setCounter] = useState(0)
    const [jobStatus, setJobStatus] = useState(null)
    const [comentAceptReject, setComentAceptReject] = useState('')
    const [isShowAcceptReject, setShowAcceptReject] = useState(selectedWorkCategoryTopBar?.status)
    // const { loading: taskTimerForUserLoading, error: taskTimerForUserError, data: taskTimerForUserData, refetch } = useQuery(TASK_TIMER_FOR_USER, { variables: { id: selectedWorkCategoryTopBar.id } })
    const [refetch, { loading: taskTimerForUserLoading, error: taskTimerForUserError, data: taskTimerForUserData, }] = useLazyQuery(TASK_TIMER_FOR_USER, { fetchPolicy: 'no-cache' })
    // console.log('taskTimerForUser', 'loading', taskTimerForUserLoading, 'error', taskTimerForUserError, 'data', taskTimerForUserData)
    
    const [startWorkTimer, { loading: startWorkLoading, error: startWorkError, data: startWorkData }] = useMutation(START_WORK)
    // console.log('startWork', 'loading', startWorkLoading, 'error', startWorkError, 'data', startWorkData)

    const [pauseWorkTimer, { loading: pauseWorkLoading, error: pauseWorkError, data: pauseWorkData }] = useMutation(PAUSE_WORK)
    // console.log('pauseWorkTimer', 'loading', pauseWorkLoading, 'error', pauseWorkError, 'data', pauseWorkData)

    const [resumeWorkTimer, { loading: resumeWorkLoading, error: resumeWorkError, data: resumeWorkData }] = useMutation(RESUME_WORK)
    // console.log('resumeWorkTimer', 'loading', resumeWorkLoading, 'error', resumeWorkError, 'data', resumeWorkData)

    const [completeWorkTimer, { loading: completeWorkLoading, error: completeWorkError, data: completeWorkData }] = useMutation(COMPLETE_WORK)
    console.log('completeWork', 'loading', completeWorkLoading, 'error', completeWorkError, 'data', completeWorkData)

    const [taskSubmit, { loading: taskSubmitLoading, error: taskSubmitError, data: taskSubmitData }] = useMutation(TASK_SUBMIT)
    // console.log('taskSubmit', 'loading', taskSubmitLoading, 'error', taskSubmitError, 'data', taskSubmitData)

    const [rejectTask, { loading: rejectTaskLoading, error: rejectTaskError, data: rejectTaskData }] = useMutation(REJECT_TASK)
    // console.log('rejectTask', 'loading', rejectTaskLoading, 'error', rejectTaskError, 'data', rejectTaskData)

    const [acceptTask, { loading: acceptTaskLoading, error: acceptTaskError, data: acceptTaskData }] = useMutation(ACCEPT_TASK)
    // console.log('acceptTask', 'loading', acceptTaskLoading, 'error', acceptTaskError, 'data', acceptTaskData)

    const [
        refetchTask,
        { loading: assetTaskLoading, error: assetError, data: assetTaskData },
    ] = useLazyQuery(TASK_ASSETS, { fetchPolicy: "no-cache" });

    useEffect(() => {
        if (focus) {
            refetchTask({ variables: { id: selectedWorkCategoryTopBar.id } });
            refetch({ variables: { id: selectedWorkCategoryTopBar.id } })
            setScreenRefresher(screensRefresher + 1)
            console.log('intial time--<>', timerIntialValue)
            setShowAcceptReject(selectedWorkCategoryTopBar?.status)
            // console.log('selectedWorkCategoryTopBar', selectedWorkCategoryTopBar)
            
        }
        else {
            console.log('---------------unfocus')
            setTimerIntialValue(null)
            setCounter(0)
            setJobStatus(null)
            setIsApprove(null)
            setHourDate('0h 0m 0s')
            setShowAcceptReject('')
            setComentAceptReject('')
            setRejected(null)
            setLoading(false)
            setIsPlay(false)
            dispatch(setIsAdhoc(true))
            dispatch(setAssetLength(0))
        }
    }, [focus])
    const getHHMMSSFromSeconds = (totalSeconds) => {
        if (!totalSeconds) {
            return '0h 0m 0s';
        }
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds % 3600 / 60);
        const seconds = totalSeconds % 60;
        const hhmmss = padTo2(hours) + 'h' + ' ' + padTo2(minutes) + 'm' + ' ' + padTo2(seconds) + 's';
        return hhmmss;
    }
    const padTo2 = (value) => {
        if (!value) {
            return '0';
        }
        return value < 10 ? String(value).padStart(1, '0') : value;
    }
    useEffect(() => {
        if (assetTaskData) {
            console.log('assetTaskData', assetTaskData)
            dispatch(setIsAdhoc(assetTaskData?.task?.adhoc))
            dispatch(setAssetLength(assetTaskData?.task?.assets?.length))
        }
    }, [assetTaskData])
    useEffect(() => {
        // console.log('*-----------*main', taskTimerForUserData, timerIntialValue)
        // console.log('*-----------*main', taskTimerForUserData)
        // if(taskTimerForUserData)
        // dispatch(setOngoingStatus(taskTimerForUserData.onGoing))
        if (taskTimerForUserData && timerIntialValue === null) {
            // console.log('*-----------*inner', taskTimerForUserData, timerIntialValue)
            // console.log('**************taskTimerForUserData**************', taskTimerForUserData.task.timer.timeSpent)
            let duration = taskTimerForUserData.task.timer.timeSpent;
            // timerIntialValueTemp=duration+1
            setHourDate(getHHMMSSFromSeconds(duration))
            setTimerIntialValue(duration)
            console.log('ongoing calling->', taskTimerForUserData.task)
            setIsPlay(taskTimerForUserData.task.timer.onGoing)
            if (taskTimerForUserData.task.timer.onGoing === true) {
                // console.log('*-----------*i nner', taskTimerForUserData, timerIntialValue)
                setCounter(counter + 1)
                // timerFuction(duration)
            }
        }
    }, [taskTimerForUserData])
    useEffect(() => {
        if (startWorkData) {
            console.log('**************startWorkData**************', startWorkData)
            console.log('**************startWorkData**************', startWorkData)
            // let duration = taskTimerForUserData.task.timer.timeSpent;
            // setHourDate(getHHMMSSFromSeconds(duration))
            // setTimerIntialValue(duration)
            setIsPlay(!isPlay)
            setCounter(counter + 1)
            timerIntialValueTemp = taskTimerForUserData.task.timer.timeSpent
            // timerFuction()
            dispatch(setOngoingStatus(startWorkData?.taskStart?.status))
        }
    }, [startWorkData])
    useEffect(() => {
        // const timer = setTimeout(() => {
        //     if (timerIntialValue != null) {
        //         setTimerIntialValue(timerIntialValue + 1)
        //         setHourDate(getHHMMSSFromSeconds(timerIntialValue))
        //         setCounter(counter + 1)
        //     }
        // }, 932)
        if (timerIntialValueTemp === 0)
            timerIntialValueTemp = timerIntialValue
        const timer = setInterval(() => {
            console.log('timer interval working')
            if (timerIntialValueTemp != null) {
                timerIntialValueTemp = timerIntialValueTemp + 1
                setTimerIntialValue(timerIntialValueTemp)
                setHourDate(getHHMMSSFromSeconds(timerIntialValueTemp))
                setCounter(counter + 1)
            }
        }, 950)
        return () => clearInterval(timer);
        // const timer = setInterval(() => {
        //     console.log('timer interval working')
        //     if (timerIntialValue != null) {
        //         let timerIntialValueTemp = timerIntialValue + 1
        //         setTimerIntialValue(timerIntialValueTemp)
        //         setHourDate(getHHMMSSFromSeconds(timerIntialValueTemp))
        //         // setCounter(counter + 1)
        //     }
        // }, 1000);
        // return () => clearInterval(timer);

        return () => clearTimeout(timer);
    }, [counter, timerIntialValueTemp]);
    // const timerFuction = (starting) => {
    //     timerIntialValueTemp=starting
    //      timer = setInterval(() => {
    //         console.log('timer interval working',timerIntialValueTemp)
    //         if (timerIntialValueTemp != null) {
    //             timerIntialValueTemp = timerIntialValueTemp + 1
    //             setTimerIntialValue(timerIntialValueTemp)
    //             setHourDate(getHHMMSSFromSeconds(timerIntialValueTemp))
    //             // setCounter(counter + 1)
    //         }
    //     }, 1000);

    // }
    // const clearTimerInterval = () => {
    //     clearInterval(timer);
    //     timer=null
    //     console.log('clearIntervalCall',timer)
    // }
    useEffect(() => {
        if (pauseWorkData) {
            console.log('**************pauseWorkTimer**************', startWorkData)
            setIsPlay(!isPlay)
            setTimerIntialValue(null)
            setCounter(0)
        }
    }, [pauseWorkData])
    useEffect(() => {
        if (resumeWorkData) {
            console.log('**************resumeWorkTimer**************', resumeWorkData.taskTimerResume.timer)
            setIsPlay(!isPlay)
            setTimerIntialValue(resumeWorkData.taskTimerResume.timer.timeSpent + 2)
            setCounter(counter + 1)
            // timerFuction(resumeWorkData.taskTimerResume.timer.timeSpent)
        }
    }, [resumeWorkData])
    useEffect(() => {
        if (completeWorkData) {
            console.log('**************completeWorkData**************', completeWorkData.taskComplete.status)
            setCounter(0)
            setTimerIntialValue(null)
            setJobStatus(completeWorkData.taskComplete.status)
        }
    }, [completeWorkData])
    useEffect(() => {
        if (taskSubmitData) {
            console.log('**************taskSubmitData**************', taskSubmitData.taskSubmitSuppInfo.status)
            setJobStatus(taskSubmitData?.taskSubmitSuppInfo?.status)

        }
    }, [taskSubmitData])
    useEffect(() => {
        if (acceptTaskData) {
            console.log('acceptTaskData', acceptTaskData)
            setShowAcceptReject(acceptTaskData.status)
        }
    }, [acceptTaskData])
    useEffect(() => {
        if (rejectTaskData) {
            console.log('rejectTaskData', rejectTaskData)
            setShowAcceptReject(rejectTaskData.taskResponsibleReject.status)
            console.log('rejectTaskData.status', rejectTaskData.taskResponsibleReject.status, selectedWorkCategoryTopBar)
        }
    }, [rejectTaskData])
    return (
        <View style={styles.safeStyle}>
            <Header
                containerStyle={{ backgroundColor: colors.green }}
                leftIcon={icons.backIcon}
                rightIcon={icons.logoIcon}
                hearderText={props?.route?.params?.headerName}
                // hearderText={selectedWorkCategoryTopBar.type}
                leftButtonIconStyle={{ width: 22, height: 22, tintColor: colors.white }}
                rightText={'H'}
                onRightAction={() => { navigation.toggleDrawer() }}
                onLeftAction={() => { navigation.goBack() }}
            />
            <MyTopTabs screenRefresh={screensRefresher} />
            {(isShowAcceptReject === 'SENT') &&
                <View style={[styles.timerContainer, {
                    flexDirection: 'column',
                    height: null,
                    justifyContent: 'flex-start',
                    paddingBottom: 20,
                    paddingTop: 20
                }]}>
                    <View style={styles.barContainerInner}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsApprove(true)
                            }}
                            style={[styles.topBtnContainer,
                            {
                                backgroundColor: isApprove === true ? colors.green : colors.white,
                                borderColor: colors.green,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            }]}>
                            <Text style={[styles.barText, { color: isApprove === true ? colors.white : colors.green }]}>{'APPROVE'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setIsApprove(false)
                            }}
                            style={[styles.topBtnContainer,
                            {
                                backgroundColor: isApprove === false ? colors.red : colors.white,
                                borderColor: colors.red,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            }]}>
                            <Text style={[styles.barText, { color: isApprove === false ? colors.white : colors.red, borderColor: colors.red }]}>{'REJECT'}</Text>
                        </TouchableOpacity>
                    </View>
                    {isApprove != null &&
                        <InputField
                            isRight={false}
                            customStyle={styles.searchInput}
                            txtPlacHolder={"Comment"}
                            value={comentAceptReject}
                            onChangeText={(text) => {
                                setComentAceptReject(text);
                            }}
                        />
                    }
                    {isApprove != null &&
                        <Button
                            backgroundColorStyle={styles.cancelBtnContainer}
                            textStyle={styles.cancelText}
                            text={'SUBMIT'}
                            clickAction={() => {
                                if (isApprove === false) {
                                    if (comentAceptReject === '') {
                                        alert('Comment is a required field')
                                    }
                                    else {
                                        console.log('else call with', selectedWorkCategoryTopBar?.id)
                                        rejectTask({
                                            variables: {
                                                taskId: selectedWorkCategoryTopBar?.id,
                                                comment: comentAceptReject
                                            }
                                        })
                                    }
                                }
                                else {
                                    acceptTask({
                                        variables: {
                                            taskId: selectedWorkCategoryTopBar?.id,
                                            comment: comentAceptReject
                                        }
                                    })
                                }
                            }}
                        />
                    }

                </View>
            }
            {(selectedWorkCategoryTopBar.status != 'SENT' || (isShowAcceptReject != 'SENT' && isShowAcceptReject != 'CONTRACTOR_REJECTED')) &&
                <View style={styles.timerContainer}>
                    <View>
                        <Text style={styles.timeHeading}>Time Spent</Text>
                        <Text style={styles.timeStyle}>{dateHour}</Text>
                    </View>
                    {isAdhoc && assetLength===0 ?
                        <View style={styles.startAssetStyle}>
                            <Text style={[styles.timeHeading,{fontSize:15,color:colors.grey}]}>TO START WORKS CHOOSE ASSETS IN ASSET LIST TAB</Text>
                        </View>
                        :
                        <View style={styles.rightContainer}>
                            {(dateHour != '0h 0m 0s' && (jobStatus != 'SUPP_INFO_SUBMITTED' && jobStatus != 'COMPLETED' && selectedWorkCategoryTopBar.status != 'SUPP_INFO_SUBMITTED' && selectedWorkCategoryTopBar.status != 'COMPLETED')) &&
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isPlay)
                                            pauseWorkTimer({
                                                variables: { id: selectedWorkCategoryTopBar.id }
                                            })
                                        else
                                            resumeWorkTimer({
                                                variables: { id: selectedWorkCategoryTopBar.id }
                                            })
                                        // setIsPlay(!isPlay)
                                    }}>
                                    {(pauseWorkLoading || resumeWorkLoading) ?
                                        <ActivityIndicator
                                            animating={(pauseWorkLoading || resumeWorkLoading)}
                                            size={'small'}
                                            color={colors.green}
                                            style={[{ marginRight: 10 }]}
                                        />
                                        :
                                        <Image source={isPlay ? icons.pauseIcon : icons.playIcon} style={styles.playIconStyle} />
                                    }
                                </TouchableOpacity>
                            }
                            {(jobStatus === 'SUPP_INFO_SUBMITTED' || selectedWorkCategoryTopBar.status === 'SUPP_INFO_SUBMITTED') ?
                                <Text style={styles.submittedText} >{strings.work_tab_container.submitted}</Text>
                                :
                                <Button
                                    loading={(startWorkLoading || completeWorkLoading || taskSubmitLoading)}
                                    text={
                                        (timerIntialValue === 0 && !isPlay) ?
                                            'START WORKS' : (jobStatus === 'COMPLETED' || selectedWorkCategoryTopBar.status === 'COMPLETED') ?
                                                'SUBMIT SUPP INFO' : 'COMPLETE WORKS'
                                    }
                                    textStyle={styles.btnStyle}
                                    backgroundColorStyle={{ borderRadius: 14, width: '72%', height: 45, marginLeft: 7 }}
                                    clickAction={() => {
                                        if ((jobStatus === 'COMPLETED' || selectedWorkCategoryTopBar.status === 'COMPLETED')) {
                                            console.log('completeBtn-else-if completed')
                                            taskSubmit({
                                                variables: { id: selectedWorkCategoryTopBar.id }
                                            })
                                        }
                                        else if (timerIntialValue === 0 && !isPlay) {
                                            console.log('completeBtn-else-if start')
                                            startWorkTimer({
                                                variables: { id: selectedWorkCategoryTopBar.id }
                                            })
                                        }
                                        else {
                                            console.log('completeBtn-else')
                                            completeWorkTimer({
                                                variables: { id: selectedWorkCategoryTopBar.id }
                                            })
                                        }
                                    }}
                                />
                            }
                        </View>
                    }
                </View>
            }
            {(isShowAcceptReject === 'CONTRACTOR_REJECTED') &&
                <View style={styles.timerContainer}>
                    <View>
                        <Text style={styles.timeHeading}>Time Spent</Text>
                        <Text style={styles.timeStyle}>{'0h 0m 00s'}</Text>
                    </View>
                </View>
            }
            <Loader loading={(startWorkLoading || completeWorkLoading || taskSubmitLoading || pauseWorkLoading || resumeWorkLoading)} isShowIndicator={false} />
            <Loader loading={(rejectTaskLoading || acceptTaskLoading)} isShowIndicator={true} />
        </View>
    );
};

export default WorkTopBarContainer;
