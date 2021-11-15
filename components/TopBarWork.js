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
    Modal
} from "react-native";
import moment from 'moment'
import colors from "./../utils/colors/";
import strings from './../locales/en.json'
import icons from './../assets/icons/'
import  {createMaterialTopTabNavigator}  from '@react-navigation/material-top-tabs';
//screens
import DetailTab from './../screens/HomeStack/DetailWorkTopBar/'
import AssetTab from './../screens/HomeStack/AssetListWorkTopBar/'
import ReportTab from './../screens/HomeStack/ReportWorkTopBar/'
import AttachmentTab from './../screens/HomeStack/AttachmentWorkTopBar/'
import HistoryTab from './../screens/HomeStack/HistoryWorkTopBar/'
import CommentTab from './../screens/HomeStack/CommentWorkTopBar/'

const TopTab = createMaterialTopTabNavigator();

const MyTopTabs = (props) => {
    return (
        <TopTab.Navigator
            headerMode={'none'}
            tabBarOptions={{
                activeTintColor: '#e91e63',
                indicatorStyle: { backgroundColor: 'white' },
                labelStyle: { fontSize: 11, fontWeight: '600', color: colors.white },
                style: {
                    backgroundColor: colors.green,
                    // elevation: 0,
                    // shadowOpacity: 0,
                }
            }}
        >
            <TopTab.Screen
                name={'strings.work_tab_container.detail'}
                component={DetailTab}
            />
            {/* <TopTab.Screen
                name={strings.work_tab_container.asset_list}
                component={AssetTab}
            />
            <TopTab.Screen
                name={strings.work_tab_container.report}
                component={ReportTab}
            />
            <TopTab.Screen
                name={strings.work_tab_container.attachment}
                component={AttachmentTab}
            />
            <TopTab.Screen
                name={strings.work_tab_container.history}
                component={HistoryTab}
            />
            <TopTab.Screen
                name={strings.work_tab_container.comment}
                component={CommentTab}
            /> */}
        </TopTab.Navigator>
    );
}


export default MyTopTabs;
