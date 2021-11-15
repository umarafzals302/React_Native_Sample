import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Keyboard,
    ImageBackground,
    Animated,
    KeyboardAvoidingView
} from "react-native";
import { styles } from "./Styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from "react-redux";
import { upperCase } from "lodash";
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
//redux
import { forgotAPI } from './../../../api/methods/userSession'
import { onForgotResponse } from './../../../store/actions/userSession'

const ForgortPassword = (props) => {
    const { navigation } = props
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);
    const [email, emailchange] = useState("");

    const inputcheck = () => {
        if (email === "") {
            alert("Email is required");
        }
        else if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(email.trim()) == false) {
            alert('Email format is invalid')
        }
        else {
            forgotApi()
        }
    };
    const forgotApi = async () => {
        try {
            setLoading(true)
            const response = await forgotAPI({
                "email": email,
            })
            if (response.status === 204) {
                setLoading(false)
                console.log('response-->success', response.data)
                alert('Email send to your account')
                dispatch(onForgotResponse(response.data))
            }
            else {
                alert('Something Went Wrong status '+response.status)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            alert('Network error please try again')
            console.log('response error-->', error)
        }
    }
    useEffect(() => {
    }, [])

    const forgotBtn = () => {
        inputcheck()
    }
    return (
        <SafeAreaView style={styles.safeStyle}>
            <KeyboardAwareScrollView
                // contentContainerStyle={styles.safeStyle}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={styles.scrollingView}>
                <View style={[styles.container]}>
                    <View style={styles.logoContainer}>
                        <TouchableOpacity
                            onPress={() => { navigation.goBack() }}
                            style={styles.backTouch}>
                            <Image
                                style={[styles.backmage]}
                                source={icons.backIcon}>
                            </Image>
                        </TouchableOpacity>
                        <Image
                            style={[styles.logoImage]}
                            source={icons.logoIcon}>
                        </Image>
                    </View>
                    <View
                        style={[styles.animatedMainView]}>
                        <Text style={styles.forgotHeading}>{strings.forgotPassword.forgot_password}</Text>
                        <Text style={styles.forgotDescription}>{strings.forgotPassword.forgot_description}</Text>
                        <InputField
                            txtPlacHolder={'Email'}
                            value={email}
                            onChangeText={(text) => {
                                emailchange(text)
                            }}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                text={upperCase(strings.forgotPassword.cancel)}
                                textStyle={[styles.btnStyle, { color: colors.green }]}
                                backgroundColorStyle={styles.cancelBtn}
                            // clickAction={loginBtn.bind(this)}
                            // loading={interLoading}
                            />
                            <Button
                                text={upperCase(strings.forgotPassword.send)}
                                textStyle={styles.btnStyle}
                                backgroundColorStyle={styles.sendBtn}
                                clickAction={forgotBtn.bind(this)}
                                loading={loading}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <TouchableOpacity>
                <Text style={styles.edacText}>{strings.login.edacText}</Text>
            </TouchableOpacity>
            <Loader isShowIndicator={false} loading={loading} />
        </SafeAreaView>
    );
};

export default ForgortPassword;