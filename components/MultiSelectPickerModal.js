import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Platform, Image, Modal, FlatList, Dimensions, StatusBar } from 'react-native'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient';
import fonts from './../assets/fonts/'
import colors from './../utils/colors'
import icons from './../assets/icons/'
import Header from './../components/Header'
import Button from './../components/Button'

const { width, height } = Dimensions.get('window')
const PickerModal = (props) => {
    const {
        list = [],
        modalVisible,
        onLeftAction
    } = props
    const [selectedList, setSelectedList] = useState([])

    useEffect(() => {
        setSelectedList([])
    }, [list])

    const renderNewWorkItem = ({ item, index }) => {
        const isSelected = selectedList.includes(item)
        const { name, value } = item
        return (
            <TouchableOpacity
                onPress={() => {
                    // props.onItemClickAction(item)
                    let selectedListTemp = [...selectedList]
                    if (isSelected) {
                        selectedListTemp = selectedListTemp.filter((_item) => _item.id != item.id || _item.value!=item.value);
                    } else selectedListTemp.push(item)
                       setSelectedList(selectedListTemp)
                }}
                style={styles.itemMainContainer}>
                <View
                    style={styles.checkStyle}
                >
                    {isSelected &&
                        <Image
                            style={styles.checkTick}
                            source={icons.tickIcon}
                        />
                    }
                </View>
                <Text style={[styles.demoClientStyle]}>{name || value }</Text>
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
        <SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <SafeAreaView>
                    <LinearGradient
                        start={{ x: 0.25, y: 0.00 }}
                        end={{ x: 1.0, y: 0.5 }}
                        locations={[0, 0.7, 1]}
                        colors={[colors.green, colors.lightGreen, colors.yellowGreen]}
                        style={[styles.container, props.containerStyle]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (onLeftAction && typeof onLeftAction) onLeftAction()
                            }}>
                            <Image
                                style={[styles.buttonIcon, props.leftButtonIconStyle]}
                                source={icons.backIcon}
                            />
                        </TouchableOpacity>
                        <Button
                            text={'Done'}
                            textStyle={styles.btnStyle}
                            backgroundColorStyle={{ borderRadius: 10, width: 70, height: 35 }}
                            clickAction={() => { props.doneClick(selectedList) }}
                        />
                    </LinearGradient>
                </SafeAreaView>
                <View style={styles.modalContainer1}>
                    <FlatList
                        data={list}
                        extraData={list}
                        listKey={moment().format('x').toString()}
                        keyExtractor={(item, index) => (`${item.id}_${index}`)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        renderItem={renderNewWorkItem}
                        ListEmptyComponent={renderEmptyContainer}
                    />
                </View>
            </Modal>
        </SafeAreaView>
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
    container: {
        flexDirection: 'row',
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%',
        backgroundColor: '#00000000',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
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
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        padding: 20,
        borderColor: colors.green,
        borderWidth: 1,
        marginTop: 5,
        borderRadius: 5
    },
    checkStyle: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        marginRight: 10,
        borderColor: colors.green,
        marginTop: -1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnStyle: {
        fontSize: 14,
        fontFamily: fonts.Regular,
        color: colors.white
    },
    buttonIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    checkTick: {
        width: 12,
        height: 12,
        tintColor: colors.green,
        resizeMode: 'contain'
    }
});




