import React, { useEffect } from "react";
import { View, Image, ImageBackground, StatusBar, Text } from "react-native";
import { useSelector } from 'react-redux'

import { styles } from './Styles';
import { CommonActions } from '@react-navigation/native';
import Preference from "react-native-preference";
import { SafeAreaView } from 'react-native-safe-area-context'
//assets
import images from './../../assets/images/'
import icons from './../../assets/icons/'
//utils
import colors from './../../utils/colors'
import preferenceKeys from '../../utils/preferenceKeys'
//locales
import strings from './../../locales/en.json'
const Splash = (props) => {
    const { navigation } = props

    const { isSignedIn } = useSelector((state) => state.userSession)

    useEffect(() => {
        if (isSignedIn) navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }] });
        else {
            setTimeout(() => {
                navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
            }, 3000);
        }
    }, []);
    return (
        <ImageBackground source={images.splashBackground} style={styles.container}>
            <View style={styles.shadedLayer} />
            <Image
                source={icons.logoIcon}
                style={styles.logoImage}
            />
            <Text style={styles.appName}>{strings.splash.app_name}</Text>
        </ImageBackground>
    );
};
export default Splash;
