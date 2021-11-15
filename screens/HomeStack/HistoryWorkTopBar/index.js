import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Image,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import strings from './../../../locales/en.json'
import icons from './../../../assets/icons/'
import colors from './../../../utils/colors'
import { styles } from "./Styles";
import Header from '../../../components/Header'
import { upperCase } from "lodash";

const HistoryWorkTopBar = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [historyList ,setHistoryList]=useState([
        {name:"Maintenance",date:'12/03/2020'},
        {name:"Repair",date:'12/03/2020'},
        {name:"Sampling",date:'12/03/2020'},
        {name:"Maintenance",date:'12/03/2020'},
        {name:"Repair",date:'12/03/2020'},
        {name:"Sampling",date:'12/03/2020'}
    ])
    const renderEmptyContainer = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{strings.history_tab.history_not_available}</Text>
            </View>
        )
    }
    const renderNotificationItem = ({ item, index }) => {
        return (
            <View
                style={styles.itemContainer}>
                    <Text style={styles.itemHeadingStyle}>{'Maintenance'}</Text>
                      <Text style={styles.dateStyle}>{'12-12-1234'}</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.safeStyle}>
            <View style={styles.flatListContainer}>
                    <FlatList
                        data={historyList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        renderItem={renderNotificationItem}
                        ListEmptyComponent={renderEmptyContainer}
                    />
            </View>
        </SafeAreaView>
    );
};
export default HistoryWorkTopBar;









