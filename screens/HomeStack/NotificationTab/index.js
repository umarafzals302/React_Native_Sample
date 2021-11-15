import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { upperCase } from "lodash";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import { setSelectedWorkCategoryTopBar } from "../../../store/actions/generalParam";
import { notificationCount } from "../../../store/actions/userSession";
import icons from "./../../../assets/icons/";
import strings from "./../../../locales/en.json";
import colors from "./../../../utils/colors";
import { styles } from "./Styles";

const DELETE_NOTIFICATION = gql`
  mutation notificationDelete($id: ID!) {
    notificationDelete(id: $id) {
      id
      read
      deletedAt
    }
  }
`;
const READ_NOTIFICATION = gql`
  mutation notificationSetToRead($id: ID!) {
    notificationSetToRead(id: $id) {
      id
      read
      deletedAt
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
  }
`;



  const NotificationTab = (props) => {
    const { navigation } = props;
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const { notifcationCount } = useSelector((state) => state.userSession)
    const { userObjectQuery } = useSelector(
      (state) => state.generalParam
    );

    const [getNotification, { loading: getLoadingNotification, error, data }] =
      useLazyQuery(NOTIFICATION, { fetchPolicy: "no-cache" });
    // console.log(
    //   "Notification",
    //   "loading",
    //   getLoadingNotification,
    //   "error",
    //   error,
    //   "data",
    //   data
    // );

    const [notificationAfterInterval, { loading: notificationAfterIntervalLoading, error: notificationAfterIntervalError, data: notificationAfterIntervalData }] =
      useLazyQuery(NOTIFICATION, { fetchPolicy: "no-cache" });

    const [
      readRequest,
      { data: readData, loading: readLoading, error: readError },
    ] = useMutation(READ_NOTIFICATION);
    // console.log('readRequest', 'readLoading', readLoading, 'readError', readError, 'readData', readData)
    const [
      deleteRequest,
      { data: deleteData, loading: deleteLoading, error: deleteError },
    ] = useMutation(DELETE_NOTIFICATION);
    // console.log('deleteRequest', 'deleteLoading', deleteLoading, 'deleteError', deleteError, 'deleteData', deleteData)

    const [notificationList, setNotificationList] = useState([]);

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        console.log("focus notification");
        getNotification();
      });
      const polling = setInterval(() => {
        console.log('interval working')
        notificationAfterInterval()
      }, 5000);
      return () => {
        clearInterval(polling);
        unsubscribe()
      }
      // return unsubscribe;
    }, []);
    useEffect(() => {
      if (data) {
        setNotificationList(data?.notificationsToMe);
        let counter = 0
        notificationList.forEach(element => {
          if (element.read === false) counter++
        });
        if (counter != notifcationCount) {
          setValue(counter);
        }
      }
    }, [data]);
    useEffect(() => {
      if (notificationAfterIntervalData) {
        console.log('interwallll working', notificationAfterIntervalData.notificationsToMe.length)
        setNotificationList(notificationAfterIntervalData?.notificationsToMe);
        let counter = 0
        notificationList.forEach(element => {
          if (element.read === false) counter++
        });
        if (counter != notifcationCount) {
          setValue(counter);
        }
      }
    }, [notificationAfterIntervalData]);
    useEffect(() => {
      if (readData) {
        getNotification();
        dispatch(
          notificationCount(notifcationCount > 0 ? notifcationCount - 1 : 0)
        );
      }
    }, [readData]);
    useEffect(() => {
      if (deleteData) {
        console.log("deleteData", deleteData.notificationDelete.read);
        getNotification();
        if (deleteData.notificationDelete.read === false)
          dispatch(
            notificationCount(notifcationCount > 0 ? notifcationCount - 1 : 0)
          );
        else
          dispatch(
            notificationCount(notifcationCount > 0 ? notifcationCount : 0)
          );
      }
    }, [deleteData]);
    const setValue = (length) => {
      if (length > 0) {
        dispatch(notificationCount(length));
      }
    };
    const renderEmptyContainer = () => {
      if (getLoadingNotification) return null;
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {strings.notification_tab.no_notification_receive_yet}
          </Text>
        </View>
      );
    };
    const fromNow = (time) => {
      const minutesAgo = Math.floor(
        (new Date().getTime() - new Date(time).getTime()) / 1000 / 60
      );
      let timestamp;
      if (minutesAgo === 0) {
        timestamp = "Just now";
      } else if (minutesAgo < 60) {
        timestamp = `${minutesAgo} minutes ago`;
      } else if (minutesAgo < 60 * 24) {
        timestamp = `${Math.floor(minutesAgo / 60)} hours ago`;
      } else {
        timestamp = `${Math.floor(minutesAgo / 60 / 24)} days ago`;
      }
      return timestamp;
    };
    const renderNotificationItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log(item)
            // if (strings.notification_statuses[item.type] === 'Task Assigned') {
            //   dispatch(setSelectedWorkCategoryTopBar(item.payload));
            //   navigation.push("HomeDrawerStack", { screen: "WorkTopBarContainer" });
            // }
          }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.itemLeftContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={icons.assetRegisterIcon}
                  style={styles.leftImage}
                />
              </View>
              <View>
                <Text style={styles.titleStyle}>
                  {upperCase(item.payload.name)}
                </Text>
                <Text style={styles.descriptionStyle}>
                  {/* {item.type} */}
                  {strings.notification_statuses[item.type]}
                </Text>
                {item.payload.date ? (
                  <View style={styles.calendarContainer}>
                    <Image
                      style={styles.calendarImage}
                      source={icons.calendarIcon}
                    />
                    <Text style={styles.dateStyle}>
                      {moment(item.payload.date, "YYYY-MM-DD").format(
                        "DD/MM/YYYY"
                      )}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={styles.itemRightContainer}>
              <View style={styles.notificationReadContainer}>
                {item.read === false && (
                  <TouchableOpacity
                    onPress={() => {
                      readRequest({
                        variables: { id: item.id },
                      });
                    }}
                    style={styles.readBtn}
                  >
                    <View style={styles.redDot} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    deleteRequest({
                      variables: { id: item.id },
                    });
                  }}
                  style={styles.crossBorder}
                >
                  <Image source={icons.crossIcon} style={styles.crossIcon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.remainingDaysStyle}>
                {fromNow(moment(item.createdAt).format())}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    const onRefresh = () => {
      getNotification();
    };
    return (
      <SafeAreaView style={styles.safeStyle}>
        <Header
          containerStyle={{ backgroundColor: colors.green }}
          // leftIcon={icons.backIcon}
          rightIcon={icons.logoIcon}
          hearderText={strings.notification_tab.notifications}
          leftButtonIconStyle={{ width: 22, height: 22, tintColor: colors.white }}
          rightText={userObjectQuery?.user?.name[0]}
          onRightAction={() => { navigation.toggleDrawer() }}
        />
        <View style={styles.flatListContainer}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={notificationList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            renderItem={renderNotificationItem}
            ListEmptyComponent={renderEmptyContainer}
          />
        </View>

        <Loader
          loading={readLoading || getLoadingNotification || deleteLoading}
          isShowIndicator={true}
        />
      </SafeAreaView>
    );
  };
  export default NotificationTab;
