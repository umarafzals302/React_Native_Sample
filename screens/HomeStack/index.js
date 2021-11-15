import { gql, useQuery ,useLazyQuery} from "@apollo/client";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
//Components
import DrawerComponent from "../../components/DrawerComponent";
//Utils
import colors from "../../utils/colors";
import fonts from "./../../assets/fonts/";
//Assets
import icons from "./../../assets/icons/";
//locals
import strings from "./../../locales/en.json";
import { setUserObjectQuery } from "./../../store/actions/generalParam";
import { notificationCount } from "./../../store/actions/userSession";

import { isIphoneX } from "./../../utils/isIphoneX";
import AssetListWorkDynamicForm from "./AssetListWorkDynamicForm";
import AssetRegisterTab from "./AssetRegisterTab/";
//Screens
import HomeTab from "./HomeTab/";
import NotificationTab from "./NotificationTab/";
import PdfViewer from "./PdfViewer";
import WorkTab from "./WorkTab/";
import WorkTopBarContainer from "./WorkTopBarContainer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("screen");

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
const TabButton = (props) => {
  const { focused, icon, label, isShowBadge } = props;
  const { notifcationCount } = useSelector((state) => state.userSession);

  const [notificationCounter, setNotificationCounter] = useState(10);
  useEffect(() => {
    console.log("notifcationCount", notifcationCount);
  }, []);
  return (
    <View
      style={[
        styles.iconContainer,
        focused ? {} : { backgroundColor: colors.tabBackground },
      ]}
    >
      <Image
        source={icon}
        style={[
          styles.tabIconStyle,
          { tintColor: focused ? colors.white : colors.grey },
        ]}
      />
      <Text style={focused ? styles.activeText : styles.unActiveText}>
        {label}
      </Text>
      {isShowBadge && notifcationCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeConterText}>{notifcationCount}</Text>
        </View>
      )}
    </View>
  );
};
function MyTabs() {
  const { userObjectQuery } = useSelector((state) => state.generalParam);

  const { currentUser,notifcationCount } = useSelector((state) => state.userSession);
  const {
    loading: getUserLoading,
    error: getUserError,
    data: getUserData,
  } = useQuery(USER, { variables: { id: currentUser?.id } });
  const [getNotification, { loading: getLoadingNotification, error, data }] =
  useLazyQuery(NOTIFICATION, { fetchPolicy: "no-cache" });
  const dispatch = useDispatch();

  useEffect(() => {
    getNotification();

  }, []);
  const setValue = (length) => {
    if (length > 0) {
      dispatch(notificationCount(length));
    }
  };
  useEffect(() => {
    if (data) {
      let counter = 0
      data?.notificationsToMe.forEach(element => {
        if (element.read === false) counter++
      });
      if (counter != notifcationCount) {
        setValue(counter);
      }
    }
  }, [data]);
  useEffect(() => {
    if (getUserData) {
      console.log("isFull Access", getUserData);
      dispatch(setUserObjectQuery(getUserData));
    }
  }, [getUserData]);
  return (
    <Tab.Navigator
      tabBarOptions={{
        // activeTintColor: colors.buttonOrange,
        showLabel: false,
        // inactiveTintColor: colors.grey,
        keyboardHidesTabBar: true,
        style: {
          height: 65,
          width: "100%",
          backgroundColor: colors.tabBackground,
          marginBottom: isIphoneX() ? 30 : 0,
          overflow: "hidden",
          borderTopWidth: 1,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          elevation: 9,
        },
      }}
      initialRouteName={"ServiceScreen"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === "Home") {
            if (focused) {
              return (
                <TabButton
                  icon={icons.homeIcon}
                  label={"Home"}
                  focused={focused}
                />
              );
            } else {
              return (
                <TabButton
                  icon={icons.homeIcon}
                  label={"Home"}
                  focused={focused}
                />
              );
            }
          }
          if (route.name === "Works") {
            if (focused) {
              return (
                <TabButton
                  icon={icons.workIcon}
                  label={strings.global.works}
                  focused={focused}
                />
              );
            } else {
              return (
                <TabButton
                  icon={icons.workIcon}
                  label={strings.global.works}
                  focused={focused}
                />
              );
            }
          }
          if (route.name === "Notifications") {
            if (focused) {
              return (
                <TabButton
                  icon={icons.notificationIcon}
                  label={strings.global.notificatioin}
                  focused={focused}
                  isShowBadge={true}
                />
              );
            } else {
              return (
                <TabButton
                  icon={icons.notificationIcon}
                  label={strings.global.notificatioin}
                  focused={focused}
                  isShowBadge={true}
                />
              );
            }
          }
          if (
            route.name === "AssetRegister" &&
            userObjectQuery?.user?.role !== "CONTRACTOR_TECHNICIAN" &&
            userObjectQuery?.user.fullAccess === true
          ) {
            if (focused) {
              return (
                <TabButton
                  icon={icons.assetRegisterIcon}
                  label={strings.global.asset_register}
                  focused={focused}
                />
              );
            } else {
              return (
                <TabButton
                  icon={icons.assetRegisterIcon}
                  label={strings.global.asset_register}
                  focused={focused}
                />
              );
            }
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Works"
        component={WorkTab}
        options={{
          tabBarLabel: "Works",
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationTab}
        options={{
          tabBarLabel: "Notifications",
        }}
      />
      {userObjectQuery?.user?.role !== "CONTRACTOR_TECHNICIAN" &&
        userObjectQuery?.user.fullAccess === true && (
          <Tab.Screen
            name="AssetRegister"
            component={AssetRegisterTab}
            options={{
              tabBarLabel: "Asset Register",
            }}
          />
        )}
    </Tab.Navigator>
  );
}

/** Home Drawer */
const HomeDrawerStack = (props) => (
  <Drawer.Navigator
    drawerStyle={{ backgroundColor: colors.background }}
    headerMode="none"
    initialRouteName="HomeScreen"
    drawerContent={(props) => <DrawerComponent {...props} />}
  >
    <Drawer.Screen name="HomeScreen" component={MyTabs} />
    <Drawer.Screen name="WorkTopBarContainer" component={WorkTopBarContainer} />
    {/* <Drawer.Screen name="AssetListWorkDynamicForm" component={AssetListWorkDynamicForm} /> */}
  </Drawer.Navigator>
);
/** Home Stack */
export default HomeStack = () => (
  <Stack.Navigator headerMode="none" initialRouteName="HomeDrawerStack">
    <Stack.Screen name="HomeDrawerStack" component={HomeDrawerStack} />
    <Stack.Screen
      name="AssetListWorkDynamicForm"
      component={AssetListWorkDynamicForm}
    />
    <Stack.Screen name="PdfViewer" component={PdfViewer} />
  </Stack.Navigator>
);
export const styles = StyleSheet.create({
  activeText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.white,
    marginTop: 5,
    width: "100%",
    textAlign: "center",
  },
  unActiveText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.grey,
    marginTop: 5,
    width: "100%",
    textAlign: "center",
  },
  iconContainer: {
    padding: 5,
    width: width * 0.25,
    // height: '100%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    height: 65,
    marginTop: isIphoneX() ? 25 : 0,
  },
  tabIconStyle: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  badgeContainer: {
    width: 23,
    height: 22,
    backgroundColor: "red",
    borderRadius: 10,
    position: "absolute",
    top: 6,
    right: (width/4)/2-23,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeConterText: {
    fontFamily: fonts.Bold,
    fontSize: 10,
    color: colors.white,
  },
});
