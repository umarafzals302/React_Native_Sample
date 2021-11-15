import React from 'react';
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity } from 'react-native'
import icons from '../assets/icons';
import { styles } from '../screens/HomeStack/AssetRegisterTab/Styles';
import colors from '../utils/colors';
import fonts from './../assets/fonts/'
var isFocus = false
// {backgroundColor:isFocus==='af' ? '#FFF8E8' : '#EDEDED' }
const InputBox = (props) => {
    return (
        <View style={[style.mainContainer, props.customStyle]}>
            <TextInput
                editable={props.editable}
                autoCapitalize={props.autoCapitalizes}
                inputAccessoryViewID={props.inputAccessoryViewID}
                placeholderTextColor={colors.grey}
                maxLength={props.maxLength}
                placeholder={props.txtPlacHolder}
                keyboardType={props.tholder}
                style={[style.inputField, { width: props.isRight ? '93%' : '100%' }, props.customInputStyle]}
                onFocus={() => {
                    isFocus = true
                    if (typeof props.onFocus == 'function') {
                        props.onFocus()
                    }
                }}
                onChangeText={(text) => {
                    if (typeof props.onChangeText == 'function') {
                        props.onChangeText(text)
                    }
                }}
                value={props.value}
                multiline={props.multiline}
                secureTextEntry={props.secureType}
            />
              {props.isRight &&
                <TouchableOpacity onPress={props.clickInput}>
                    <Image
                        source={icons.searchIcon}
                        style={style.leftIconStyle}
                    />
                </TouchableOpacity>
            }
        </View>
    )
}
export default InputBox
const style = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        height: 46,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.grey
    },
    inputField: {
        width: '93%',
        fontSize: 16,
        color: colors.black,
        fontFamily: fonts.Regular,
        // paddingLeft:10, 
        paddingRight:10
        // backgroundColor:'red'
    },
    leftIconStyle: {
        width: 20,
        height: 25,
        resizeMode: 'contain',
        marginRight: 5
    }
});




