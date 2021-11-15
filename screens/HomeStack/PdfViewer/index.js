import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import PDFView from 'react-native-view-pdf/lib/index';
import { Pdf } from 'react-native-pdf-light';
import { useDispatch, useSelector } from "react-redux";
import { notificationCount } from '../../../store/actions/userSession'
import moment from 'moment'
import strings from './../../../locales/en.json'
import icons from './../../../assets/icons/'
import colors from './../../../utils/colors'
import { styles } from "./Styles";
import Header from '../../../components/Header'
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Picker } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob'
import { PinchZoomView } from 'react-native-pinch-to-zoom-view';


// import Loader from "../../../components/Loader";
// import { setSelectedWorkCategoryTopBar } from "../../../store/actions/generalParam";

import DownloadManager from '../../../utils/DownloadManager'

import { store } from './../../../store'
const { authToken } = store.getState().userSession
const { width, height } = Dimensions.get('window')
const pickerWidth = width / 4
const DOWNLOAD_REQUEST = gql`
  mutation downloadRequestWithSrc($fileId: String!) {
    downloadRequest(fileId: $fileId) {
      url
      extension
    }
  }
`;
const PdfViewer = (props) => {
  const { navigation } = props

  const pickerList = props?.route?.params?.item?.drawings
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreInfo, setMoreInfo] = useState("");
  const [isEnablePicker, setEnablePicker] = useState(false);
  const [degree, setDegree] = useState(0);
  const [selected, setSelected] = useState(props.route.params.item.drawings[props?.route?.params?.selectedPdfFile])
  // const [selected, setSelected] = useState(pickerList[props.route.params])

  const [downloadedFile, setDownloadedFile] = useState('');
  const dispatch = useDispatch()
  const [
    downloadRequest,
    { data: downloadData, loading: downloadLoading, error: downloadError },
  ] = useMutation(DOWNLOAD_REQUEST);

  useEffect(() => {
    console.log('elementPdf', authToken, props.route.params.item)
    setMoreInfo(props.route.params.item)
    downloadRequest({
      variables: {
        fileId: props.route.params.item.drawings[props?.route?.params?.selectedPdfFile].file.id,
      },
    });

  }, [])

  useEffect(() => {
    if (downloadData) {
      console.log("downloadData", downloadData.downloadRequest.url);
      DownloadManager.download(downloadData.downloadRequest.url, false, (response) => {
        //when donwloaded
        console.log('DownloadManager-response', response)
        setLoading(false)
        setDownloadedFile(response.path);
      }, (response) => {
        setLoading(true)
        //when start
      }, (progress) => {
        //when progress

      })
    }
  }, [downloadData]);

  const listDrawing = (array) => {
    return array.map((element) => {
      return (
        <View key={element.key} style={styles.drawingContainer}>
          <Text style={styles.drawingText}>{element?.file?.originalName}</Text>
        </View>
      );
    });
  };
  const renderMoreModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer1}>
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, width: "100%" }}
          >
            <View style={styles.modalContentContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Image style={styles.crossStyle} source={icons.crossIcon} />
              </TouchableOpacity>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.asset_id}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.id}
              </Text>
              <Text style={styles.itemListHeading}>{"Asset Name"}</Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.name}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.asset_type}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.type}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.system_reference}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.system?.name}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.system_type}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.system?.type}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.created}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moment(moreInfo?.createdAt).format("DD/MM/YY")}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.asset_owner}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.owner?.name}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.department}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.department}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.coordinates}
              </Text>
              <Text
                style={[
                  styles.itemListdetailText,
                  { color: colors.green, textDecorationLine: "underline" },
                ]}
              >
                {moreInfo?.coordinates?.latitude +
                  ", " +
                  moreInfo?.coordinates?.longitude}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.additional_information}
              </Text>
              <Text style={styles.itemListdetailText}>
                {moreInfo?.additionalInformation}
              </Text>
              <Text style={styles.itemListHeading}>
                {strings.asset_register_tab.drawing}
              </Text>
              {moreInfo?.drawings?.length > 0 &&
                listDrawing(moreInfo?.drawings)}
              {/* <Text style={styles.itemListHeading}>{strings.asset_register_tab.upcoming_work}</Text>
                            {MORE_INFO?.upcomingWork?.length > 0 && listWork(MORE_INFO.upcomingWork)}
                            <Text style={styles.itemListHeading}>{strings.asset_register_tab.recent_work}</Text>
                            {MORE_INFO?.recentWork?.length > 0 && listRecent(MORE_INFO.recentWork)} */}
            </View>
          </ScrollView>
          {/* <Loader loading={assetForTaskLoading} isShowIndicator={true} /> */}
        </View>
      </Modal>
    );
  };







  const onValueChange = (value: string) => {
    console.log(value?.file?.id)
    setSelected(value)
    setDegree(0)
    downloadRequest({
      variables: {
        fileId: value?.file?.id
      },
    });
  }
  return (
    <SafeAreaView style={styles.safeStyle}>
      <View style={styles.topContainer}>
        <View
          style={styles.topnameContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Picker
              // selected
              mode="dropdown"
              style={{ width: pickerWidth - 12 }}
              selectedValue={selected}
              onValueChange={onValueChange}
            >
              {pickerList.map((element) => {
                return (
                  <Picker.Item label={element.file.originalName} value={element} />
                )
              })}
            </Picker>
            <Image
              style={styles.dropDownStyle}
              source={icons.dropDownIcon}
            />
          </View>
        </View>
        <View style={styles.rotationContainer}>
          <TouchableOpacity
            onPress={() => {
              if (degree != 270) {
                setDegree(degree - 90)
              }
              else {
                setDegree(0)
              }
            }}
            style={styles.btnTouch}>
            <Image
              source={icons.pdfBackIcon}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (degree != 270) {
                setDegree(degree + 90)
              }
              else {
                setDegree(0)
              }
            }}
            style={[styles.btnTouch, { marginLeft: 10 }]}>
            <Image
              source={icons.pdfNextIcon}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={
            [styles.btnTouch,
            { width: '20%', alignItems: 'flex-end' }]
          }
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Image
            source={icons.pdfCrossIcon}
            style={styles.imageStyle}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            width: '100%',
            height: '80%',
            transform: [{ rotate: degree + 'deg' }]
          }}
        >
          <PinchZoomView>
            <Pdf
              source={downloadedFile}
            />
          </PinchZoomView>
        </View>

        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
          }}
          style={styles.bottomContainer}>
          <View>
            <Text style={styles.BottomHeading}>{moreInfo?.name}</Text>
            <Text style={styles.BottomTitle}>{moreInfo?.system?.name}</Text>
            <Text style={styles.BottomReadMore}>Read more info</Text>
          </View>
        </TouchableOpacity>



      </View>
      <Loader loading={(loading)} isShowIndicator={true} />
      {renderMoreModal()}

    </SafeAreaView>
  );
};
export default PdfViewer;









