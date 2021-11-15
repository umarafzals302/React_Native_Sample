import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, FlatList, Dimensions } from 'react-native'
import moment from 'moment'

import fonts from './../assets/fonts/'
import colors from './../utils/colors'
import icons from './../assets/icons/'
import Button from './Button';
import SignatureScreen from "react-native-signature-canvas";


const { width, height } = Dimensions.get('window')
const PickerModal = (props) => {
    const { onOK, modalVisible,doneAction } = props
    const ref = useRef();

    const handleOK = (signature) => {
        // console.log('handleOK', signature);
        if (onOK && typeof onOK === 'function') {
            onOK(signature);
        }
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        console.log("end");
        ref.current.readSignature();
    };

    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >

                <View style={styles.modalContainer1}>
                    <View style={{ width: '100%', height: 300 }}>
                        <SignatureScreen
                            ref={ref}
                            onOK={(data) => {
                                doneAction(data) 
                                handleOK(data)
                            }}
                            webStyle={style}
                        />
                    </View>
                    <Text style={styles.noteText}>Please sign here</Text>
                    <View style={styles.btnContainer}>
                        <Button
                            backgroundColorStyle={styles.cancelBtnContainer}
                            textStyle={styles.cancelText}
                            text={'Cancel'}
                            clickAction={props.cancelAction}
                        />
                        <Button
                            backgroundColorStyle={styles.doneBtnContainer}
                            text={'Done'}
                            textStyle={styles.doneText}
                            clickAction={() => {
                                handleConfirm()
                                // handleClear()
                            }}
                        />
                    </View>

                </View>
            </Modal>
        </View>
    )
}
export default PickerModal
const styles = StyleSheet.create({
    modalContainer1: {
        // flex: 1,
        width: width,
        height: height,
        backgroundColor: colors.white,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    emptyContainer: {
        width: '100%',
        height: height - 140,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        fontFamily: fonts.Regular,
        fontSize: 14,
        color: colors.black,
        marginLeft: 7
    },
    itemMainContainer: {
        width: '100%',
        padding: 20,
        borderColor: colors.green,
        borderWidth: 1,
        marginTop: 5,
        borderRadius: 5
    },
    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50
    },
    cancelBtnContainer: {
        width: '45%',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.green
    },
    doneBtnContainer: {
        width: '45%',
    },
    doneText: {
        fontFamily: fonts.Regular,
        color: colors.white,
        fontSize: 16
    },
    cancelText: {
        fontFamily: fonts.Regular,
        color: colors.green,
        fontSize: 16
    },
    noteText:{
        fontSize:14,
        fontFamily:fonts.Regular,
        color:colors.grey,
        marginTop:10
    }
});




