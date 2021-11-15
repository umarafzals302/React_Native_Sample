import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image,ActivityIndicator } from 'react-native'
import colors from './../utils/colors'
import Fonts from './../assets/fonts/'
const AssetListTopForm = (props) => {
    return (
            <View style={styles.mainContainer}>
                    <KeyboardAwareScrollView>
                        <Text style={[styles.inputHeading, { marginTop: 10 }]}>{strings.work_asset_list_container.suggest}</Text>
                        <InputField
                            autoCapitalizes={false}
                            value={suggestion}
                            onChangeText={(text) => {
                                setSuggestion(text)
                            }}
                        />
                        <Text style={styles.inputHeading}>{strings.work_asset_list_container.notes}</Text>
                        <InputField
                            autoCapitalizes={false}
                            value={note}
                            onChangeText={(text) => {
                                setNote(text)
                            }}
                        />
                        <Text style={styles.inputHeading}>{strings.work_asset_list_container.files}</Text>
                        <View style={styles.addImageBtnToch}>
                            <TouchableOpacity
                                style={{ marginLeft: 0 }}
                                onPress={() => {
                                    addDocmentClick()
                                    // setShowPickerModel(true)
                                }}>
                                <Image source={icons.cameraIcon} style={styles.addImageStyle} />
                            </TouchableOpacity>
                            {fileList.length > 0 &&
                                fileList?.map((element) => {
                                    return (
                                        <View key={element.key} style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 25, marginBottom: 15 }}>
                                            <Image style={[styles.fileTumbnail, { width: 47, height: 40 }]} source={icons.pdfIcon} />
                                            {/* <Image style={styles.fileTumbnail} source={{ uri: element.imageUri }} /> */}
                                        </View>
                                    );
                                })}
                        </View>
                        <Text style={styles.inputHeading}>{strings.work_asset_list_container.signature}</Text>
                        <View style={styles.addImageBtnToch}>
                            <TouchableOpacity
                                style={{ marginLeft: 0 }}
                                onPress={() => {
                                    setShowSignature(true)
                                }}>
                                <Image source={icons.autographIcon} style={styles.addImageStyle} />
                            </TouchableOpacity>
                            <Image style={styles.fileTumbnail} source={{ uri: signaturePicture }} />
                        </View>
                        <View style={styles.btnContainer}>
                            <Button
                                backgroundColorStyle={styles.cancelBtnContainer}
                                textStyle={styles.cancelText}
                                text={'SAVE AS DRAFT'}
                            // clickAction={props.cancelAction}
                            />
                            <Button
                                loading={completeLoading}
                                backgroundColorStyle={styles.doneBtnContainer}
                                text={'COMPLETE'}
                                textStyle={styles.doneText}
                                clickAction={() => {
                                    if (suggestion != '') {
                                        const variableObject = `{
                                                "Suggested Action": "${suggestion}",
                                                "Notes": "${note === '' ? "null" : note}",
                                                "Add Files": [],
                                                "Add Signature": "${signatureId === '' ? "null" : signatureId}"
                                            }`
                                        completedRequest({
                                            variables: {
                                                "id": '28bd8593-be28-4dee-99dc-4aab5c0fdb89',
                                                "formValues": variableObject
                                            }
                                        })
                                    } else {
                                        alert('Suggestion required')
                                    }
                                }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </View>
    )
}
export default AssetListTopForm
const style = StyleSheet.create({
    mainContainer:{
        flex:1,
        paddingLeft:15,
        paddingRight:15,
        padding:20
      },
      inputHeading: {
        fontFamily: fonts.Bold,
        color: colors.black,
        fontSize: 14,
        marginTop:25
      },
      addImageBtnToch: {
        flexDirection: 'row',
        marginTop: 15,
        flexWrap:'wrap',
        alignItems:'center'
      },
      fileTumbnail:{
        width:70,
        height:52,
        resizeMode:'stretch',
      },
      addImageStyle: {
        width: 45,
        height: 45,
        resizeMode: 'contain'
      },
      btnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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
    itemBtnContainer:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
    }
});




