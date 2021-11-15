import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, FlatList, Dimensions } from 'react-native'
import moment from 'moment'

import fonts from '../assets/fonts'
import colors from '../utils/colors'
import icons from '../assets/icons'
import Button from './Button';
import SignatureScreen from "react-native-signature-canvas";
import AvatarComponent from './Image';


const { width, height } = Dimensions.get('window')
const ImageViewer = (props) => {
    const { modalVisible, imageUri, backBtnClick,downloadBtnClick } = props
    return (
        <View>
            <Modal
                animationType='none'
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer1}>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            downloadBtnClick()
                        }}
                        >
                            <Image
                                source={icons.saveIcon}
                                style={styles.saveImageStyle}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                backBtnClick()
                            }}
                        >
                            <Image
                                source={icons.crossIcon}
                                style={[styles.saveImageStyle, { width: 17, height: 17 }]}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Image
                            source={{ uri: imageUri }}
                            style={[styles.mainImage]}
                        /> */}
                        <AvatarComponent
                               source={{ uri: imageUri }}
                               style={[styles.mainImage]}
                            defaultSource={icons.pdfIcon}
                            size={'small'}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default ImageViewer
const styles = StyleSheet.create({
    modalContainer1: {
        // flex: 1,
        width: width,
        height: height,
        backgroundColor: '#000000AA',
        // justifyContent: 'center',
    },
    saveImageStyle: {
        width: 24,
        height: 24,
        tintColor: colors.white,
        resizeMode: 'contain',

    },
    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: colors.green,
        padding: 20
    },
    doneBtnContainer: {
        width: '45%',
    },
    doneText: {
        fontFamily: fonts.Regular,
        color: colors.white,
        fontSize: 16
    },
    mainImage: {
        width: '70%',
        height: 300,
        resizeMode: 'contain',
        backgroundColor: colors.white,
        borderRadius: 20
    }
});




