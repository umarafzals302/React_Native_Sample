import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect, useRef } from "react";
import { LogBox, StatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";
import NotificationPopup from "react-native-push-notification-popup";
import { useSelector } from "react-redux";
import Routing from "./../Routing";
import colors from "./../utils/colors";

LogBox.ignoreAllLogs(true);
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor(colors.transparent);
StatusBar.setBarStyle("dark-content");

export default App = (props) => {
  const { authToken, isSignedIn } = useSelector((state) => state.userSession);
  const popupRef = useRef(null);
  const qglClient = new ApolloClient({
    uri: "https://app-service-transfer-edac-dev.azurewebsites.net/graphql",
    headers: {
      Authorization: authToken
        ? `Bearer ${authToken}`
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiOGQxYmY4YTYtN2IxMi00Yzg3LWI4YzUtMDczMTQ4ZDdkMmZhIiwiZW1haWwiOiJlZGFjb3BlcmF0aXZlQGdtYWlsLmNvbSIsInJvbGUiOiJjbGllbnQtb3BlcmF0aXZlIn0sInN1YiI6IjhkMWJmOGE2LTdiMTItNGM4Ny1iOGM1LTA3MzE0OGQ3ZDJmYSIsImlhdCI6MTYzMjIxODQzNSwiZXhwIjoxNjMyMzA0ODM1fQ.9mDTkavpL6AcqdIEjbyS9LYdSchylZ1P8cy6-PtxwlI",
    },
    cache: new InMemoryCache(),
  });
  useEffect(() => {
    console.log("authToken", authToken, isSignedIn);
    createNotificationListenersLatest();
  }, []);
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log("requestUserPermission", "enabled", enabled);
  };
  const createNotificationListenersLatest = async () => {
    await requestUserPermission();
    // const token = await messaging().getToken()
    this.notificationListener = messaging().onMessage(async (remoteMessage) => {
      console.log(
        "createNotificationListenersLatest",
        "notificationListener-remoteMessage",
        JSON.stringify(remoteMessage)
      );
      const { notification, data } = remoteMessage;
      const { title, body } = notification;
      showNotification(title, body, data);
    });
    this.backgroundStateListener = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        if (remoteMessage) {
          const { notification, data } = remoteMessage;
          // const { title } = notification
          console.log(
            "Notification caused app to open from backgroundStateListener:"
          );
          handleNotification(data, data.status);
        }
      }
    );
  };
  const handleNotification = (data, type) => {
    let dataDetails = data;
    console.log("-------", dataDetails);
    // let _params = {
    //     scr: 'notification',
    //     jobId: dataDetails,
    //     onAction: () => {
    //         console.log('onAction Call')
    //         bellSoundThirty.stop()
    //     }
    // }
    // navigateAction("Upcoming")
  };

  const showNotification = (title, body, data) => {
    if (popupRef.current) {
      popupRef.current.show({
        // onPress: () => handleNotification(data, data.status),
        appIconSource: icons.appIcon,
        appTitle: "Edac",
        timeText: "Now",
        title: title,
        body: body,
        slideOutTime: 5000,
      });
    }
  };

  return (
    <ApolloProvider client={qglClient}>
      <Routing />
      <NotificationPopup ref={popupRef} style={{ zIndex: 99 }} />
      <FlashMessage position="bottom" floating={true} />
    </ApolloProvider>
  );
};
