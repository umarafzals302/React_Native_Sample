import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TextInput,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import moment from "moment";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Entypo from "react-native-vector-icons/Entypo";
import * as ImagePicker from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import colors from "./../utils/colors";
import Button from "./Button";
import icons from "../assets/icons";
import fonts from "../assets/fonts";

const GalleryModal = (props) => {
  const [isCameraPermission, setIsCameraPermssion] = useState(false);
  const { isShowGalleryModal, doneAction,cancelAction,documentPickerAction,galleryAction ,cameraAction,videoAction} = props
  useEffect(() => {
  }, []);
  const chooseVideo = () => {
    let options = {
      title: "Select Video",
      mediaType: "video",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Video from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "video",
      },
      videoQuality: "low",
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = {
          uri: response.uri,
          name: moment().format("x") + ".mp4",
          type: "video/mp4",
        };
        videoAction(source)
      }
    });
  };
  const chooseCamera = () => {
    let options = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Photo from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      width: 300,
      height: 300,
      quality: 0.2
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = {
          uri: response.uri,
          name: moment().format("x") + ".jpg",
          type: "image/jpg",
        };
        cameraAction(source)
      }
    });
  };
  const chooseFile = () => {
    let options = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Photo from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      mediaType:'mixed',
      width: 300,
      height: 300,
      quality: 0.2
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        console.log('response',response)
        // const source = {
        //   uri:
        //     Platform.OS === "ios"
        //       ? "File:///" + response.uri.split("file:/").join("")
        //       : response.uri,
        //   name: moment().format("x") + ".jpg",
        //   type: "image/jpg",
        // };
        const source = {
          uri:response.uri,
          name: response.type? moment().format("x") + ".jpg" :  moment().format("x") + ".mp4",
          type: response.type ? "image/jpg" : "video/mp4",
        };
        galleryAction(source)
      }
    });
  };
  const addDocmentClick = async () => {
    try {
        const fileResponse = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
        console.log('fileResponse', fileResponse[0].uri, fileResponse[0].type, fileResponse[0].name)
        documentPickerAction(fileResponse)
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err
        }
    }
}


  return (
    <Modal transparent={true} visible={isShowGalleryModal}>
      <View style={styles.container}>
        <View style={styles.mediaPicker}>
          <Text style={styles.attchMediaText}>Choose an action</Text>
          <View style={styles.optionsView}>
            <Pressable
              onPress={() => {
                doneAction()
                setTimeout(() => {
                  // selectFile();
                  addDocmentClick()
                }, 300);
              }}
              style={styles.optionButton}
            >
              <Image
                source={icons.fileGallery}
                style={styles.fileImage}
              />
              <Text style={styles.optionButtonText}>Folder</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                doneAction()
                setTimeout(() => {
                  chooseFile();
                }, 300);
              }}
              style={styles.optionButton}
            >
              <Image
                source={icons.galleryIcon}
                style={styles.fileImage}
              />
              <Text style={styles.optionButtonText}>Photos</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                doneAction()
                setTimeout(() => {
                  chooseCamera();
                }, 300);
              }}
              style={styles.optionButton}
            >
              <Image
                source={icons.cameraRoll}
                style={styles.fileImage}
              />
              <Text style={styles.optionButtonText}>Camera</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                doneAction()
                setTimeout(() => {
                  chooseVideo();
                }, 300);
              }}
              style={styles.optionButton}
            >
              <Image
                source={icons.videoIcon}
                style={styles.fileImage}
              />
              <Text style={styles.optionButtonText}>Video</Text>
            </Pressable>
          </View>
          <Button
            backgroundColorStyle={{ 
              backgroundColor: colors.lightGrey ,
              width:'80%',
              alignSelf:'center',
              marginTop:25,
              marginBottom:30
            }}
            textStyle={{
            fontFamily:fonts.Bold,
              fontSize:16
            }}
            text={'Cancel'}
            clickAction={cancelAction}
          />
        </View>
      </View>

    </Modal>
  );
};

export default GalleryModal;
export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000AA',
    flex: 1
  },
  menuImage: {
    width: 25,
    height: 20,
    resizeMode: "contain",
    tintColor: colors.white,
  },
  headerFooter: {
    backgroundColor: colors.black,
  },
  headerFooterText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 22,
  },
  friendsButton: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: colors.white,
    borderRadius: 0,
    marginTop: 20,
  },
  textInput: {
    width: "90%",
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginTop: 14,
    alignSelf: "center",
    marginBottom: 30,
  },
  mediaPicker: {
    width: "100%",
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 0,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    paddingTop:20,
    paddingBottom:10
  },
  attchMediaText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 22,
    fontFamily: fonts.Bold
  },
  optionsView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 40,
  },
  optionButton: {
    alignItems: "center",
  },
  optionButtonText: {
    marginTop: 7,
    fontSize: 16,
  },
  containerQR: {
    position: "absolute",
    backgroundColor: colors.white,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  descText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.green,
  },
  fileImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  }
});
