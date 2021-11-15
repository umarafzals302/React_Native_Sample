import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash'
import colors from './../utils/colors'
import fonts from './../assets/fonts/'
export default Header = (props) => {
    return (
        <SafeAreaView>
            <LinearGradient
                start={{ x: 0.25, y: 0.00 }}
                end={{ x: 1.0, y: 0.5 }}
                locations={[0, 0.7, 1]}
                colors={[colors.green,colors.lightGreen ,colors.yellowGreen]}
                style={[styles.container, props.containerStyle]} >
                <TouchableOpacity
                    disabled={_.isNil(props.onLeftAction)}
                    onPress={() => {
                        if (props.onLeftAction && typeof props.onLeftAction) {
                            props.onLeftAction()
                        }
                    }}
                    style={[styles.buttonLeftContainer, props.leftButtonContainerStyle]}>
                    {props.leftIconChildren ?
                        props.leftIconChildren
                        :
                        props.leftIcon &&
                        <Image
                            style={[styles.buttonIcon, props.leftButtonIconStyle]}
                            source={props.leftIcon}
                        />
                    }
                    {props.leftText &&
                        <Text style={[styles.buttonText, props.leftButtonTextStyle]}>
                            {props.leftText}
                        </Text>
                    }
                </TouchableOpacity>
                <View style={[styles.centerComponentStyle, props.centerComponentExtraStyle]}>
                    {props.centerComponent}
                    {props.hearderText &&
                        <Text style={[styles.hearderText, props.hearderTextStyle]}>
                            {props.hearderText}
                        </Text>
                    }
                </View>
                {/* <TouchableOpacity
                    disabled={_.isNil(props.onRightAction)}
                    onPress={() => {
                        if (props.onRightAction && typeof props.onRightAction) {
                            props.onRightAction()
                        }
                    }}
                    style={[styles.buttonRightContainer, props.rightButtonContainerStyle]}>
                    {props.rightIcon &&
                        <Image
                            style={[styles.buttonIcon, props.rightButtonIconStyle]}
                            source={props.rightIcon}
                        />
                    }
                    {props.rightText &&
                        <Text style={[styles.buttonText, props.rightButtonTextStyle]}>
                            {props.rightText}
                        </Text>
                    }
                </TouchableOpacity> */}
                 <TouchableOpacity
                    disabled={_.isNil(props.onRightAction)}
                    onPress={() => {
                        if (props.onRightAction && typeof props.onRightAction) {
                            props.onRightAction()
                        }
                    }}
                    style={[styles.buttonRightContainer, props.rightButtonContainerStyle]}>
                    {props.rightText &&
                       <View style={styles.buttonTextContiner}>
                        <Text style={[styles.buttonText, props.rightButtonTextStyle]}>
                            {props.rightText}
                        </Text>
                        </View>
                    }
                </TouchableOpacity>
           
            </LinearGradient>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        backgroundColor: '#00000000',
        alignItems: 'center',
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
    },
    buttonLeftContainer: {
        width: 75,
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 15,
        flexDirection: 'row',
    },
    buttonRightContainer: {
        width: 75,
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 15,
        flexDirection: 'row',
    },
    centerComponentStyle: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
    },
    buttonIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    buttonTextContiner: {
        width:40,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30,
        backgroundColor:colors.grey
    },
    buttonText:{
        color:colors.white,
        fontFamily:fonts.Bold,
        fontSize:18
    },
    hearderText: {
        fontSize: 15,
        fontFamily:fonts.Bold,
        color: colors.white,
        textAlign: 'center'
    }
})
