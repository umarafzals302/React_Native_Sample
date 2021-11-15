import { gql, useLazyQuery, useMutation } from "@apollo/client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Linking
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import strings from './../../../locales/en.json'
import icons from './../../../assets/icons/'
import colors from './../../../utils/colors'
import { styles } from "./Styles";
import Header from '../../../components/Header'
import Loader from "../../../components/Loader";
import { upperCase } from "lodash";
import {
    setHomeToWork,
    setSelectedWorkCategoryTopBar,
    setOngoingStatus,
    setUserObjectQuery
} from '../../../store/actions/generalParam'
const FCM_ID = gql`
  mutation setFcmid($id: ID!, $fcmId: String!) {
    setFcmid(id: $id, fcmId: $fcmId) {
      id
    }
  }
`;
const GET_DATA_BY_TYPE = gql`
  query operativeHome($id: ID!, $withoutRejected: Boolean) {
    user(id: $id) {
      id
      tasks(withoutRejected: $withoutRejected) {
        id
        type
        notes
        deadline
        urgent
        assetsCount
        compliant
        status
        site {
          companyName
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
const NOTIFICATION = gql`
  query notificationsToMe {
    notificationsToMe {
      id
      read
      createdAt
      deletedAt
      type
      payload {
        entityId
        siteId
        name
        company
        date
        __typename
      }
      __typename
    }
  }`
const USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phonenumber
      role
      isAdmin
      fullAccess
      adhoc
      notificationSchedule
      notificationStatus
      sites {
        id
        __typename
      }
      picture {
        id
        srcUrl
        __typename
      }
      company {
        id
        name
        __typename
      }
      __typename
    }
  }
`;

const HomeTab = (props) => {
    const { navigation } = props;
    const [refreshing, setRefreshing] = useState(false);

    const setValue = (length) => {
        if (length > 0) {
            dispatch(notificationCount(length));
        }
    };

    const [
        sendFcm,
        { data: sendFcmData, loading: sendFcmLoading, error: sendFcmError },
    ] = useMutation(FCM_ID);
    
    const [getDataByType, { loading, data }] = useLazyQuery(GET_DATA_BY_TYPE, {
        fetchPolicy: "no-cache",
    });
    const { data: notifications } = useLazyQuery(NOTIFICATION);
    console.log(
        "🚀 ~ file: index.js ~ line 93 ~ HomeTab ~ notifications",
        notifications
    );

    useEffect(() => {
        if (notifications) {
            setValue(notifications.notificationsToMe.length);
        }
    }, [notifications]);

    const { currentUser, fcmToken } = useSelector((state) => state.userSession)
    const { selectedWorkCategoryTopBar, userObjectQuery } = useSelector(
        (state) => state.generalParam
    );
    const userId = currentUser?.id || ''

    const [getUserInfo, {
        loading: getUserLoading,
        error: getUserError,
        data: getUserData,
    }] = useLazyQuery(USER, { fetchPolicy: "no-cache" });

    const [newWorkList, setNewWorkList] = useState([]);
    const [workListByType, setNewWorkListByType] = useState([]);


    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            console.log("focus Home", fcmToken);
            console.log("idssss->", currentUser);
            getUserInfo({ variables: { id: currentUser?.id } })
            sendFcm({
                variables: {
                    // "fcmId": dbdzOE8bxk47pxeW43SSeu:APA91bESMbcC
                    id: userId,
                    fcmId: fcmToken,
                },
            });
            getDataByType({
                variables: { id: userId, withoutRejected: true },
            });
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, []);
    useEffect(() => {
        console.log("myFCMQUery");
        if (sendFcmData) {
            console.log("myFCMQUery", sendFcmData);
        }
    }, [sendFcmData]);
    useEffect(() => {
        if (getUserData) {
            dispatch(setUserObjectQuery(getUserData));
            console.log('getUserData', getUserData)
        }
    }, [getUserData]);
    useEffect(() => {
        console.log("called", data);
        if (data) {
            var temp = [];
            var tempNewWork = [];
            data?.user.tasks.forEach((element) => {
                if (element.status === "SENT") {
                    tempNewWork.push(element);
                }
                if (temp.length === 0) {
                    var addingCount = element;
                    addingCount.countVariable = 1;
                    temp.push(addingCount);
                } else {
                    var __FOUND = temp.find(function (item, index) {
                        if (item.type == element.type) {
                            temp[index].countVariable = temp[index].countVariable + 1;
                            return true;
                        }
                    });
                    if (__FOUND === undefined) {
                        var addingCount = element;
                        addingCount.countVariable = 1;
                        temp.push(addingCount);
                    }
                }
            });
            setNewWorkListByType(temp);
            setNewWorkList(tempNewWork);
            console.log("temp", tempNewWork);
        }
    }, [data]);

    const renderEmptyContainer = () => {
        // if (getLoadingType) return null
        return (
            <View style={[styles.emptyContainer, { height: 30, marginTop: 5 }]}>
                <Text style={styles.emptyText}>
                    {strings.home_tab.no_work_list_yet}
                </Text>
            </View>
        );
    };
    const renderWorkByTypeItem = ({ item, index }) => {
        console.log("item", item.type);
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(setHomeToWork(item.type));
                    navigation.navigate("Works", { categoryParam: item.type });
                }}
                style={styles.itemMainContainerByType}
            >
                <View style={styles.itemRightMain}>
                    <Text style={styles.typeHeadingStyle}>{item.type}</Text>
                    <Text style={styles.workInstructionStyle}>
                        {item.countVariable + " Work instruction"}
                    </Text>
                    <View style={styles.calendarContainer}>
                        <Text style={styles.dateStyle}>
                            {moment(item.deadline).format("MMM DD YYYY")}
                        </Text>
                        <Image style={styles.calendarImage} source={icons.calendarIcon} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const categoryNameSelection = (item) => {
        if (item.type === "TESTING") {
          return "Testing";
        } else if (item.type === "COMPLIANCE_CHECK") {
          return "Compliance Check";
        } else if (item.type === "OTHER") {
          return "Other";
        } else if (item.type === "SAMPLING") {
          return "Sampling";
        } else if (item.type === "AUDIT") {
          return "Audit";
        } else if (item.type === "REPAIR") {
          return "Repair";
        } else if (item.type === "SURVEY") {
          return "Survey";
        } else {
          return "Sampling";
        }
      };
    const renderNewWorkItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    // console.log('my item ', item)
                    dispatch(setSelectedWorkCategoryTopBar(item));
                    dispatch(setOngoingStatus(item.status));
                    navigation.push("HomeDrawerStack", { 
                        screen: "WorkTopBarContainer",
                        params: {
                            headerName: categoryNameSelection(item),
                          }
                    });
                }}
                style={styles.itemMainContainer}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            item.type === "TESTING"
                                ? icons.testingIcon
                                : item.type === "COMPLIANCE_CHECK"
                                    ? icons.complianceIcon
                                    : item.type === "OTHER"
                                        ? icons.complianceIcon
                                        : item.type === "SAMPLING"
                                            ? icons.testTubeIcon
                                            : item.type === "AUDIT"
                                                ? icons.auditIcon
                                                : item.type === "REPAIR"
                                                    ? icons.complianceIcon
                                                    : icons.surveyIcon
                        }
                        style={styles.leftImage}
                    />
                </View>
                <View style={styles.itemRightMain}>
                    <View style={styles.assetNoContainer}>
                        <Text style={styles.titleStyle}>{item.type}</Text>
                        {item.urgent && (
                            <Image source={icons.urgentIcon} style={styles.urgentImage} />
                        )}
                    </View>
                    <View style={[styles.assetNoContainer, { marginTop: 10 }]}>
                        <Text style={styles.noAssetStyle}>{"Works D/L"}</Text>
                        <Text style={styles.remainingDaysStyle}>{item.deadline}</Text>
                    </View>
                    <View style={styles.assetNoContainer}>
                        <Text style={styles.noAssetStyle}>{"No of Assets"}</Text>
                        <Text style={styles.noAssetStyle}>{item.assetsCount}</Text>
                    </View>
                    <Text style={[styles.demoClientStyle]}>{item.site.companyName}</Text>
                    {item?.notes != null && (
                        <View
                            style={[
                                styles.assetNoContainer,
                                { width: "70%", justifyContent: null, alignItems: null },
                            ]}
                        >
                            <Text style={styles.noAssetStyle}>{"Notes: "}</Text>
                            <Text style={[styles.noAssetStyle, { width: "80%" }]}>
                                {item?.notes}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };
    const onRefresh = () => {
        getDataByType({
            variables: { id: userId, withoutRejected: true },
        });
    };
    return (
        <SafeAreaView style={styles.safeStyle}>
            <Header
                containerStyle={{ backgroundColor: colors.green }}
                // leftIcon={icons.backIcon}
                rightIcon={icons.logoIcon}
                hearderText={strings.home_tab.home}
                leftButtonIconStyle={{ width: 22, height: 22, tintColor: colors.white }}
                rightText={userObjectQuery?.user?.name[0]}
                onRightAction={() => { navigation.toggleDrawer() }}
            />
            <KeyboardAwareScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {!loading && (
                    <>
                        <View style={styles.flatListContainer}>
                            <Text style={styles.headingText}>
                                {strings.home_tab.work_instruction_type}
                            </Text>
                            <FlatList
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: "space-between" }}
                                data={workListByType}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ width: "90%", alignSelf: "center" }}
                                renderItem={renderWorkByTypeItem}
                                ListEmptyComponent={renderEmptyContainer}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                        <View style={styles.flatListContainer}>
                            <Text style={styles.headingText}>
                                {strings.home_tab.new_work_instruction}
                            </Text>
                            <FlatList
                                data={newWorkList}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 140 }}
                                renderItem={renderNewWorkItem}
                                ListEmptyComponent={renderEmptyContainer}
                            />
                        </View>
                    </>
                )}
            </KeyboardAwareScrollView>
            <Loader loading={loading} isShowIndicator={true} />
        </SafeAreaView>
    );
};
export default HomeTab;
