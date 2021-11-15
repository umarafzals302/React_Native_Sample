import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, FlatList, Dimensions } from 'react-native'
import moment from 'moment'

import fonts from './../assets/fonts/'
import colors from './../utils/colors'
import icons from './../assets/icons/'
import Header from './../components/Header'

const { width, height } = Dimensions.get('window')
const PickerModal = (props) => {
    const {
        modalVisible,
        onItemClickAction,
        list,
        backBtnClick,
    } = props

    const renderNewWorkItem = ({ item, index }) => {
        const { name, value } = item
        return (
            <TouchableOpacity
                onPress={() => { onItemClickAction(item) }}
                style={styles.itemMainContainer}>
                <Text style={[styles.demoClientStyle]}>{name || value || item}</Text>
            </TouchableOpacity>
        );
    };
    const renderEmptyContainer = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{'No item exist'}</Text>
            </View>
        )
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <Header
                    onLeftAction={backBtnClick}
                    containerStyle={{ backgroundColor: colors.green, marginTop: 0 }}
                    leftIcon={icons.backIcon}
                    hearderText={'Picker Selection'}
                    leftButtonIconStyle={{ width: 22, height: 22, tintColor: colors.white }}
                />
                <View style={styles.modalContainer1}>
                    <FlatList
                        data={list}
                        listKey={moment().format('x').toString()}
                        keyExtractor={(item, index) => (`${item.id}_${index}`)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        renderItem={renderNewWorkItem}
                        ListEmptyComponent={renderEmptyContainer}
                    />
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
    }
});




