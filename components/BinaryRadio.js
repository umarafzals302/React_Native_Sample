import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import colors from './../utils/colors'
import fonts from './../assets/fonts/'
const BinaryRadio = (props) => {
    const { loading, color, size, isYes, onChangeValue,valuesToShow } = props

    return (
        <View style={styles.barContainerInner}>
            <Pressable
                onPress={() => {
                    if (isYes===valuesToShow[1]?.value) onChangeValue(valuesToShow[0]?.value)
                    else if (isYes===null) onChangeValue(valuesToShow[0]?.value)
                    else if (isYes===valuesToShow[0]?.value) onChangeValue(null)
                    // if (isYes==='No') onChangeValue('Yes')
                    // else if (isYes===null) onChangeValue('Yes')
                    // else if (isYes==='Yes') onChangeValue(null)
                }}
                style={[styles.topBtnContainer,
                { backgroundColor: isYes===valuesToShow[0]?.value ? colors.green : colors.white }]}>
                <Text style={[styles.barText, { color: isYes===valuesToShow[0]?.value ? colors.white : colors.black }]}>{valuesToShow[0]?.value}</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    if (isYes===valuesToShow[0]?.value) onChangeValue(valuesToShow[1]?.value)
                    else if (isYes===null) onChangeValue(valuesToShow[1]?.value)
                    else if (isYes===valuesToShow[1]?.value) onChangeValue(null)
                    // if (isYes==='Yes') onChangeValue('No')
                    // else if (isYes===null) onChangeValue('No')
                    // else if (isYes==='No') onChangeValue(null)
                }}
                style={[styles.topBtnContainer,
                { backgroundColor: isYes===valuesToShow[1]?.value ? colors.green : colors.white }]}>
                <Text style={[styles.barText, { color: isYes===valuesToShow[1]?.value ? colors.white : colors.black }]}>{valuesToShow[1]?.value}</Text>
            </Pressable>
        </View>
    )
}
export default BinaryRadio
const styles = StyleSheet.create({
    barContainerInner: {
        flexDirection: 'row',
        width: '65%',
        height: 40,
        borderRadius: 7,
        borderColor: colors.grey,
        borderWidth: .8,
        marginTop: 10
    },
    topBtnContainer: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 6
    },
    barText: {
        fontFamily: fonts.Regular,
        fontSize: 14,
        color: colors.black
    },
});




