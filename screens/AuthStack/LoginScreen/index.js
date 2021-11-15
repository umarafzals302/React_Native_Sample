import React, { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Easing,
    Linking
} from "react-native";
import { sha1 } from 'react-native-sha1';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from "react-redux";
import messaging from '@react-native-firebase/messaging';

//components
import InputField from './../../../components/FloatingLabelInputField'
import Button from './../../../components/Button'
import Loader from './../../../components/Loader'
//assets
import icons from './../../../assets/icons/'
import images from "../../../assets/images";
//utils
import colors from './../../../utils/colors'
//locales
import strings from './../../../locales/en.json'
import { styles } from "./Styles";

//redux
import { loginAPI } from './../../../api/methods/userSession'
import { onLoginResponse, setFcm, setAuthToken } from './../../../store/actions/userSession'
import { upperCase } from "lodash";
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

const LoginButton = (props) => {

    const { email = "", password = "", onChangeGetUserLoading, setLoading } = props

    const dispatch = useDispatch()

    const { authToken } = useSelector((state) => state.userSession)

    const [data, setData] = useState(null);

    const [getUserInfo, {
        loading: getUserLoading,
        error: getUserError,
        data: getUserData,
    }] = useLazyQuery(USER, { fetchPolicy: "no-cache" });

    useEffect(() => {
        if (authToken) getUserInfo({ variables: { id: data?.id } })
    }, [authToken]);

    useEffect(() => {
        console.log('useEffect-call')
        if (getUserData) {
            setLoading(false)
            console.log('getUserData', getUserData?.user?.role)
            if (getUserData?.user?.role === 'CLIENT_OPERATIVE' || getUserData?.user?.role === 'CONTRACTOR_TECHNICIAN') {
                // dispatch(setFcm(token))
                dispatch(onLoginResponse(data))
            }
            else {
                alert('You are not allowed to access this app under this role, please contact administrator')
            }
        }
    }, [getUserData]);

    const loginFunction = async (token) => {
        try {
            const salt = '6B5gDfKELf8yQ6hkBvy6PEA4vAxJDEsN'
            const hash = await sha1(salt + password)
            setLoading(true)
            console.log('loginAPI-check-hash', hash.toLowerCase())
            const response = await loginAPI({
                "email": email.toLowerCase(),
                "password": hash.toLowerCase(),
            })
            console.log('loginAPI-check-response')
            if (response.status === 200) {
                console.log('loginAPI-response', response.data.id, token)
                console.log(response.data)
                setData(response.data)
                dispatch(setAuthToken(response.data.token))
                dispatch(setFcm(token))
                // dispatch(setFcm(token))
                // dispatch(onLoginResponse(response.data))
            }
        } catch (error) {
            setLoading(false)
            if (error?.response?.status) {
                alert('Invalid email password combination')
            }
            else {
                alert(error)
            }
            // alert('Network error please try again')
            // console.log('loginAPI-error-->', error)
        }
    }
    const fetchFcmToken = () => {
        messaging().hasPermission()
            .then(hasPermission => {
                messaging().getToken()
                    .then(fcmToken => {
                        if (fcmToken) {
                            console.log('Firebase token: ' + JSON.stringify(fcmToken))
                            loginFunction(fcmToken)
                        } else {
                            // user doesn't have a device token yet
                            console.log('Firebase token: ' + JSON.stringify(fcmToken))
                        }
                    }).catch(error => {
                        console.log('Firebase getToken error: ' + JSON.stringify(error))
                        console.log('Firebase getToken error: ' + error)
                    })
            })
            .catch(error => {
                console.log('Firebase hasPermission error: ' + JSON.stringify(error))
            })
    }

    const inputcheck = async () => {
        if (email === "") {
            alert("Email is required");
        }
        else if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(email.trim()) == false) {
            alert('Email format is invalid')
        }
        else if (password === "") {
            alert("Enter Password");
        }
        else {
            fetchFcmToken()
        }
    };

    return (
        <Button
            {...props}
            clickAction={inputcheck}
        />
    )
}

const LoginScreen = (props) => {
    const { navigation } = props

    const [animated, setAnimated] = useState(false)

    const [loading, setLoading] = useState(false);
    const [email, emailchange] = useState("");
    const [password, passwordchange] = useState("");
    // const [email, emailchange] = useState("edacoperative@gmail.com");
    // const [password, passwordchange] = useState("admin");

    const animatedValue = new Animated.Value(animated ? -70 : 0);
    const animatedOpacityValue = new Animated.Value(animated ? 1 : 0);

    useEffect(() => {
        setTimeout(() => {
            moveLogo()
        }, 500);
    }, [])

    const moveLogo = () => {
        Animated.timing(animatedValue, {
            toValue: -70,
            easing: Easing.elastic(),
            duration: 1000,
            useNativeDriver: true
        }).start()
        setTimeout(() => {
            Animated.timing(animatedOpacityValue, {
                toValue: 1,
                easing: Easing.elastic(),
                duration: 1500,
                useNativeDriver: true
            }).start(() => {
                setAnimated(true)
            })
        }, 500);
    }

    return (
        <View style={styles.safeStyle}>
            <ImageBackground
                style={styles.container}
                source={images.splashBackground}>
                <View style={styles.shadedLayer} />
                <KeyboardAwareScrollView
                    // contentContainerStyle={styles.safeStyle}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    style={styles.scrollingView}>
                    <View style={[styles.container]}>
                        <Animated.Image
                            style={[styles.logoImage, { transform: [{ translateY: animatedValue }] }]}
                            source={icons.logoIcon}>
                        </Animated.Image>
                        <Animated.View
                            style={[styles.animatedMainView, { opacity: animatedOpacityValue }]}>
                            <Text style={styles.loginText}>{strings.login.login}</Text>
                            <InputField
                                autoCapitalizes={"none"}
                                txtPlacHolder={'Email'}
                                value={email}
                                onChangeText={(text) => {
                                    emailchange(text)
                                }}
                            />
                            <InputField
                                secureType={true}
                                txtPlacHolder={'Password'}
                                value={password}
                                onChangeText={(text) => {
                                    passwordchange(text)
                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('ForgotPassword')
                            }}>
                                <Text style={styles.forgotText}>{strings.login.forgot_password}</Text>
                            </TouchableOpacity>
                            {animated ?
                                <LoginButton
                                    email={email}
                                    password={password}
                                    text={upperCase(strings.login.login)}
                                    textStyle={styles.btnStyle}
                                    backgroundColorStyle={{ borderRadius: 14, marginTop: 33 }}
                                    loading={loading}
                                    setLoading={(status) => {
                                        setLoading(status)
                                    }}
                                />
                                :
                                <Button
                                    text={upperCase(strings.login.login)}
                                    textStyle={styles.btnStyle}
                                    backgroundColorStyle={{ borderRadius: 14, marginTop: 33 }}
                                    disabled={true}
                                    clickAction={() => { }}
                                />
                            }
                        </Animated.View>
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    onPress={() => {
                        const subject = "";
                        const message = "";
                        Linking.openURL(`mailto:info@edac.ie?subject=${subject}&body=${message}`)
                    }}>
                    <Text style={styles.edacText}>{strings.login.edacText}</Text>
                </TouchableOpacity>
            </ImageBackground>
            <Loader isShowIndicator={false} loading={loading} />
        </View>
    );
};

export default LoginScreen;