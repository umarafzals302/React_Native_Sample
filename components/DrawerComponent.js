import React, { Component, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Preference from 'react-native-preference'
import { upperCase } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
// import { setUser } from './../store/actions/userSession'
//Assets
import fonts from '../assets/fonts';

//Utils
import colors from '../utils/colors';
import preferenceKeys from '../utils/preferenceKeys';

//Components
import DrawerItem from './DrawerItem';
import Button from './../components/Button'

//locals
import strings from './../locales/en.json'

//redux 
import { logoutUser } from '../store/actions/userSession'
import icons from '../assets/icons';

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
import {
    setUserObjectQuery,
} from "../store/actions/generalParam";
const CompanyDrawerContent = (props) => {

    const { navigation } = props
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.userSession)
    const { userObjectQuery } = useSelector(
        (state) => state.generalParam
    );
    const [getUserInfo, {
        loading: getUserLoading,
        error: getUserError,
        data: getUserData,
    }] = useLazyQuery(USER, { variables: { id: currentUser?.id } });

    useEffect(() => {
        console.log('user data---->', currentUser)
        getUserInfo({ variables: { id: currentUser?.id } })
    }, [])
    useEffect(() => {
        if (getUserData) {
            dispatch(setUserObjectQuery(getUserData));
            console.log('getUserData', getUserData)
        }
    }, [getUserData]);
    return (
        <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.drawerContainer}>
                <View style={styles.topHeader}>
                    <Text style={styles.drawerTilte}>{strings.drawer.account}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.toggleDrawer();
                        }}
                        style={styles.crossTouch}
                    >
                        <Image
                            style={styles.crossIcon}
                            source={icons.crossIcon}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonTextContiner}>
                    <Text style={styles.buttonText}>
                        {userObjectQuery?.user?.name[0]}
                    </Text>
                </View>
                <Text style={styles.nameText}>{userObjectQuery?.user?.name}</Text>
                <Text style={styles.emailText}>{currentUser?.email}</Text>

                {/* <DrawerItem
                        title={'Account'}
                        containerStyle={{ marginTop: 30 }}
                        onPress={() => {

                        }}
                    /> */}
                <View style={{ flex: 1 }} />
                <Button
                    text={upperCase(strings.drawer.logout)}
                    textStyle={[styles.btnStyle, { color: colors.green }]}
                    backgroundColorStyle={styles.cancelBtn}
                    clickAction={() => {
                        dispatch(logoutUser())
                    }}
                // loading={interLoading}
                />
            </View>
            <Loader loading={getUserLoading} isShowIndicator={true} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: colors.tabBackground,
        paddingVertical: 70,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    drawerTilte: {
        // fontFamily: fonts.Bold,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelBtn: {
        borderRadius: 14,
        marginTop: 33,
        width: '80%',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.green
    },
    btnStyle: {
        fontSize: 17,
        fontWeight: '500',
        lineHeight: 22,
        color: colors.white
    },
    buttonTextContiner: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: colors.grey,
        marginTop: 25
    },
    buttonText: {
        color: colors.white,
        fontFamily: fonts.Bold,
        fontSize: 34
    },
    nameText: {
        fontFamily: fonts.Regular,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15
    },
    emailText: {
        fontFamily: fonts.Regular,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        color: colors.grey,
        width: '85%'
    },
    crossIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',

    },
    topHeader: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    crossTouch: {
        position: 'absolute',
        right: 0,
        bottom: 5
    }
})

export default CompanyDrawerContent