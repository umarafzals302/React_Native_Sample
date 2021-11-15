import React from "react";
import { LogBox, StatusBar } from "react-native";
import { NetworkProvider } from "react-native-offline";
import { Provider } from "react-redux";
import Apploo from "./components/Apollo";
import { store } from "./store";
import colors from "./utils/colors";

LogBox.ignoreAllLogs(true);
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor(colors.transparent);
StatusBar.setBarStyle("dark-content");

const App = (props) => {
  return (
    <NetworkProvider>
      <Provider store={store}>
        <Apploo />
      </Provider>
    </NetworkProvider>
  );
};

export default App;
