import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    StyleSheet,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { height } = Dimensions.get('screen');
const imagePickerOptions = {
    width: 300,
    height: 300,
    quality: 0.2
};

export default ImagePickerModel = (props) => {
    const borderRadius = 13
    const {
        onHideModel,
        showPickerModel,
        handleChoosePhoto
    } = props

    const onChooseFromLibraryPress = () => {
        launchImageLibrary(imagePickerOptions, onImagePickerResponse)
    }

    const onTakePhotoPress = () => {
        console.log('click on camera')
        launchCamera(imagePickerOptions, onImagePickerResponse)
    }

    const onImagePickerResponse = (response) => {
        console.log('click response', response)
        if (handleChoosePhoto && typeof handleChoosePhoto == 'function') handleChoosePhoto(response)
    }

    const onHideModelInner = () => {
        if (onHideModel && typeof onHideModel == 'function') onHideModel()
    }

    return (
        <Modal
            animationType="slide"
            presentationStyle="overFullScreen"
            transparent={true}
            visible={showPickerModel}>
            <View style={[styles.modalStyle, { justifyContent: 'flex-end', }]}>
                < View style={{ marginHorizontal: 20, marginBottom: 30 }}>
                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            onPress={() => {
                                onHideModelInner()
                                setTimeout(() => {
                                    onChooseFromLibraryPress()
                                }, 1000)
                            }}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: '#FAFAFA',
                                alignItems: 'center', justifyContent: 'center',
                                borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius
                            }}>
                            <Text style={{ color: '#3A77F6', padding: 14, fontSize: 20 }}>
                                {'Choose from Library'}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ height: 2, width: '100%' }} />
                        <TouchableOpacity
                            onPress={() => {
                                onHideModelInner()
                                setTimeout(() => {
                                    onTakePhotoPress()
                                }, 1000)
                            }}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: 'white',
                                alignItems: 'center', justifyContent: 'center',
                                borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius
                            }}>
                            <Text style={{ color: '#3A77F6', padding: 14, fontSize: 20 }}>{'Take Photo'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ backgroundColor: '#FAFAFA', borderRadius: borderRadius, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            onHideModelInner()
                        }}>
                        <Text style={{ color: 'red', padding: 14, fontSize: 20 }}>{'Cancel'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    modalStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
        // backgroundColor: '#00000000'
    },
});

