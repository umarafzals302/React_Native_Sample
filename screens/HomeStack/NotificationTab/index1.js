import gql from "graphql-tag";
import { upperCase } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Mutation, Query } from "react-apollo";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header";
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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { notifcationCount } = useSelector((state) => state.userSession);

  const [notificationList, setNotificationList] = useState([]);
  useEffect(() => {}, []);
  const setValue = (length) => {
    if (length > 0) {
      dispatch(notificationCount(length));
    }
  };
  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {strings.notification_tab.no_notification_receive_yet}
        </Text>
      </View>
    );
  };
  const renderNotificationItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeftContainer}>
          <View style={styles.imageContainer}>
            <Image source={icons.assetRegisterIcon} style={styles.leftImage} />
          </View>
          <View>
            <Text style={styles.titleStyle}>
              {upperCase(item.payload.name)}
            </Text>
            <Text style={styles.descriptionStyle}>{item.type}</Text>
            <View style={styles.calendarContainer}>
              <Image style={styles.calendarImage} source={icons.calendarIcon} />
              <Text style={styles.dateStyle}>{item.payload.date}</Text>
            </View>
          </View>
        </View>
        <View style={styles.itemRightContainer}>
          <View style={styles.notificationReadContainer}>
            {item.read === false && (
              <Mutation mutation={READ_NOTIFICATION}>
                {(readNotificationMethod, { loading, error }) => {
                  const submit = () => {
                    if (loading) {
                      return;
                    }
                    if (error) {
                      return null;
                    }
                    console.log(error);
                    readNotificationMethod({
                      variables: { id: item.id },
                    });
                    dispatch(
                      notificationCount(
                        notifcationCount > 0 ? notifcationCount - 1 : 0
                      )
                    );
                  };
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        submit();
                      }}
                      style={styles.readBtn}
                    >
                      <View style={styles.redDot} />
                    </TouchableOpacity>
                  );
                }}
              </Mutation>
            )}

            <Mutation
              mutation={DELETE_NOTIFICATION}
              update={(cache) => {
                const data = cache.readQuery({
                  query: NOTIFICATION,
                });
                const newData = {
                  notificationsToMe: data.notificationsToMe.filter(
                    (t) => t.id != item.id
                  ),
                };
                cache.writeQuery({
                  query: NOTIFICATION,
                  data: newData,
                });
              }}
            >
              {(deleteNotificationMethod, { loading, error }) => {
                const submit = () => {
                  if (loading) {
                    return;
                  }
                  if (error) {
                    return null;
                  }
                  console.log(error);
                  deleteNotificationMethod({
                    variables: { id: item.id },
                  });
                  dispatch(
                    notificationCount(
                      notifcationCount > 0 ? notifcationCount - 1 : 0
                    )
                  );
                };
                return (
                  <TouchableOpacity
                    onPress={() => {
                      submit();
                    }}
                    style={styles.crossBorder}
                  >
                    <Image source={icons.crossIcon} style={styles.crossIcon} />
                  </TouchableOpacity>
                );
              }}
            </Mutation>
          </View>
          <Text style={styles.remainingDaysStyle}>
            {moment(item.payload.date).fromNow()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeStyle}>
      <Header
        containerStyle={{ backgroundColor: colors.green }}
        // leftIcon={icons.backIcon}
        rightIcon={icons.logoIcon}
        hearderText={strings.notification_tab.notifications}
        leftButtonIconStyle={{ width: 22, height: 22, tintColor: colors.white }}
        rightText={"H"}
        onRightAction={() => {
          navigation.toggleDrawer();
        }}
      />

      <Query
        query={NOTIFICATION}
        onCompleted={(data) => {
          setNotificationList(data.notificationsToMe);
          if (notificationList.length === 0) {
            setValue(data.notificationsToMe.length);
          }
        }}
      >
        {({ data, error, loading }) => {
          if (loading)
            return (
              <View style={[styles.container]}>
                <ActivityIndicator
                  // animating={loading}
                  animating={loading}
                  size={"large"}
                  color={colors.green}
                  style={[{ marginLeft: 5, alignSelf: "center" }]}
                />
              </View>
            );
          else if (error)
            return (
              <View>{alert("Something went wrong please try again")}</View>
            );
          else {
            return (
              <View style={styles.flatListContainer}>
                <FlatList
                  data={data.notificationsToMe}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 140 }}
                  renderItem={renderNotificationItem}
                  ListEmptyComponent={renderEmptyContainer}
                />
              </View>
            );
          }
        }}
      </Query>
    </SafeAreaView>
  );
};
export default NotificationTab;
