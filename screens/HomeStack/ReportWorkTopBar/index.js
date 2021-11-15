import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Pressable
} from "react-native";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import icons from "./../../../assets/icons/";
import ImagePickerModel from "./../../../components/ImagePickerModel";
import PickerModal from "./../../../components/PickerModal";
import ImageViewer from "./../../../components/ImageViewer";
import colors from "./../../../utils/colors";
import { styles } from "./Styles";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AvatarComponent from './../../../components/Image';
import DownloadManager from '../../../utils/DownloadManager'
import moment from "moment";

const REPORT_TASKS = gql`
  query taskReport($id: ID!) {
    task(id: $id) {
      id
      status
      contractorResponsibleUser {
        id
        name
        __typename
      }
      internalResponsible {
        id
        name
        __typename
      }
      assets {
        id
        asset {
          id
          name
          type
          createdAt
          department
          additionalInformation
          coordinates {
            longitude
            latitude
            __typename
          }
          system {
            id
            type
            name
            __typename
          }
          owner {
            id
            name
            __typename
          }
          site {
            id
            name
            __typename
          }
          __typename
        }
        formValues
        formTemplate {
          id
          content
          fileMultiTemplate {
            id
            originalName
            __typename
          }
          fileSingleTemplate {
            id
            originalName
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
const DOWNLOAD_REQUEST = gql`
  mutation downloadRequestWithSrc($fileId: String!) {
    downloadRequest(fileId: $fileId) {
      url
      extension
    }
  }
`;

const imageTypes = {
  PNG: "PNG",
  JPEG: "JPEG",
  JPG: "JPG",
  GIF: "GIF",
}

const ReportWorkTopBar = (props) => {
  const { navigation } = props;
  const { selectedWorkCategoryTopBar, userObjectQuery } = useSelector(
    (state) => state.generalParam
  );

  const [showPickerModel, setShowPickerModel] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageForApi, setProfileImageForApi] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPickerShow, setPickerShow] = useState(false);
  const [isShowViewer, setShowViewer] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [selectAllAssetType, setSelectAllAssetType] = useState("");
  const [orignalList, setOrignalList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [selectItem, setSelectItem] = useState(0);
  const [signaturePicture, setSignaturePicture] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const focus = useIsFocused();

  const [
    refetchReport,
    { data: reporteData, loading: reportLoading, error: reportError }
  ] = useLazyQuery(REPORT_TASKS, { fetchPolicy: "no-cache" });
  // console.log('REPORT_TASKS', 'loading', reportLoading, 'error', reportError, 'data', reporteData)

  const [
    downloadRequest,
    { data: downloadData, loading: downloadLoading, error: downloadError },
  ] = useMutation(DOWNLOAD_REQUEST);
  // console.log(
  //   "downloadRequest",
  //   "downloadLoading",
  //   downloadLoading,
  //   "downloadError",
  //   downloadError,
  //   "downloadData",
  //   downloadData
  // );

  const [downloadFileRequest, { data: downloadFileData, loading: downloadFileLoading, error: downloadFileError }] = useMutation(DOWNLOAD_REQUEST)
  // console.log('downloadFileRequest', 'downloadFileLoading', downloadFileLoading, 'downloadFileError', downloadFileError, 'downloadFileData', downloadFileData)

  const [loading, setLoading] = useState(false);
  const [selectAllAssets, setSelectAllAssets] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [recursionList, setRecursionList] = useState([])
  const [recursionListIndex, setRecursionListIndex] = useState(0)

  useEffect(() => {
    console.log('focus----', focus)
    setSignaturePicture(null);
    setActiveIndex(-1)
    setSelectAllAssetType('')
    setFilterList([])
    setOrignalList([])
    setSelectedImageUri(null)
    refetchReport({ variables: { id: selectedWorkCategoryTopBar.id } });
  }, [props.screenRefresh, focus]);

  const dowloadFunction = (urlVariable) => {
    DownloadManager.download(urlVariable, true, (response) => {
      //when donwloaded
      console.log('DownloadManager-response', response)
      setLoading(false)
      setTimeout(() => {
        alert('Your file is downloaded successfully')

      }, 500)
      // setDownloadedFile(response.path);
    }, (response) => {
      setLoading(true)
      //when start
    }, (progress) => {
      //when progress
    })

  }

  useEffect(() => {
    if (reporteData) {
      console.log(reporteData)
      console.log("reporteData", reporteData?.task?.assets);
      const distinctArray = [
        ...new Set(reporteData?.task.assets.map((a) => a.asset?.system.type)),
      ];
      // console.log(distinctArray);
      setSelectAllAssets(distinctArray);
      // setSelectAllAssetType(distinctArray[0]);
      if (distinctArray.length > 0) {
        setSelectAllAssetType(distinctArray[0].charAt(0).toUpperCase() + distinctArray[0].slice(1).toLowerCase());
      }
      setOrignalList(reporteData?.task?.assets);
      var data = reporteData?.task.assets.filter(function (item) {
        return item.asset?.system.type.charAt(0).toUpperCase() + item.asset?.system.type.slice(1).toLowerCase() == distinctArray[0].charAt(0).toUpperCase() + distinctArray[0].slice(1).toLowerCase()

      });
      setFilterList(data);
    }
  }, [reporteData]);

  useEffect(() => {
    if (downloadData) {
      // console.log("downloadData", downloadData.downloadRequest.url);
      setSignaturePicture(downloadData.downloadRequest.url);
    }
  }, [downloadData]);

  useEffect(() => {
    if (downloadFileData && recursionListIndex != 0) {
      // console.log('downloadData', downloadFileData.downloadRequest.url)
      let tempArray = [...fileList]
      tempArray.push({ downloadedUrl: downloadFileData.downloadRequest.url })
      setFileList(tempArray)
      nextDownload(recursionList, recursionListIndex)
    }
  }, [downloadFileData])
  const nextDownload = (list, index) => {
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    var element = list[index]
    console.log('nextingnexting-index', element, index)
    if (element != null && element != undefined) {
      console.log('nextingnexting-index-if')
      downloadFileRequest({
        variables: {
          "fileId": element.toString(),
        }
      })
      setRecursionListIndex(index + 1)
    }
    else {
      // console.log('nextingnexting-index-else')
      if (list?.length > index) {
        nextDownload(list, index + 1)
      }
      else {
        console.log('index-', index)
      }
    }
  }
  const categoryNameChanger = (nameFromQuery) => {
    if (nameFromQuery === "AIR_MONITOR") {
      return "Air Monitor/Location";
    } else if (nameFromQuery === "BUNDS") {
      return "Bunds";
    } else if (nameFromQuery === "GULLEY") {
      return "Gulley";
    } else if (nameFromQuery === "INTERCEPTOR") {
      return "Interceptor";
    } else if (nameFromQuery === "NOISE_MONITOR") {
      return "Noise Monitor / Location";
    } else if (nameFromQuery === "ODOUR_MONITOR") {
      return "Odour Monitor / Location";
    } else if (nameFromQuery === "DRAIN") {
      return "Drain / Pipe";
    } else if (nameFromQuery === "MANHOLE") {
      return "Manhole";
    } else if (nameFromQuery === "SAMPLING_POINT") {
      return "Sampling Point";
    } else if (nameFromQuery === "SURFACE_WATER") {
      return "Surface water";
    } else if (nameFromQuery === "GREASE_TRAP") {
      return "Grease Trap";
    } else if (nameFromQuery === "PUMP") {
      return "Pump";
    } else if (nameFromQuery === "GROUND_WATER") {
      return "Ground Water";
    } else if (nameFromQuery === "BIOFILTER") {
      return "Biofilter";
    } else if (nameFromQuery === "MISCELLANEOUS") {
      return "Miscellaneous";
    } else if (nameFromQuery === "GENERAL_FACILITY") {
      return "General Facility";
    }
    else {
      return nameFromQuery
    }
  }
  const isEmptyAllValues = (_selectedList) => {
    // console.log('called---------------------------------', _selectedList)
    var isTrue = true
    if (_selectedList.length > 0) {
      _selectedList.forEach(element => {
        if (element.value != null) {
          isTrue = false
        }
      });
      return isTrue

    } else return true
  }
  const getStatusMultivalue = (_selectedList, slectedValue) => {
    if (_selectedList.length > 0) {
      let filterdList = _selectedList.filter((element) => (slectedValue === element?.value))
      return (
        <Image
          style={styles.comlianceStyle}
          source={filterdList.length > 0 && filterdList[0]?.comply == true ?
            icons.complyIcon
            : icons.nonCompliantIcon
          }
        />
      )
    } else return null
  }
  const getStatusMultivalueForMainItem = (_selectedList, slectedValue) => {
    if (_selectedList.length > 0) {
      let filterdList = _selectedList.filter((element) => (slectedValue === element?.value))
      return filterdList.length > 0 && filterdList[0]?.comply == true ? true : false
    } else return null
  }
  const getStatusOfInputForMainItem = (_selectedList, selectedOutput) => {
    const selectedList = selectedOutput.split(',')
    if (_selectedList.length > 0) {
      let isComply = true
      for (const iterator of selectedList) {
        let filterdList = _selectedList.filter((element) => iterator == element?.value)
        if (filterdList.length > 0 && filterdList[0].comply != true) {
          isComply = false
          break;
        }
      }
      return isComply ? true : false
    } else return null
  }

  const isImage = (url = null) => {
    if (url) {
      const extension = url?.split('.').pop()
      console.log('extension', extension, imageTypes[extension.toUpperCase()])
      return imageTypes[extension.toUpperCase()] !== undefined
    }
  }

  const renderAccordianItem = ({ item, index }) => {
    let listOfValues = [];
    var isComplyIcon = []

    const listOfFields = JSON.parse(item?.formTemplate.content);
    const listOfValue = JSON.parse(item?.formValues) || {};
    const listOfKeys = Object.keys(listOfValue);
    const listOfData = Object.values(listOfValue);
    // console.log('JSON.parse-Form-value', JSON.parse(item?.formValues))

    listOfFields.map((item, index) => {
      const foundedIndex = listOfKeys.indexOf(item.parameterName);
      console.log('itemmmm', item)
      if (item.type === "BOOLEAN" && foundedIndex > -1) {
        if (listOfData[foundedIndex] != '' && listOfData[foundedIndex] != null) {
          var a = getStatusMultivalueForMainItem(item?.values, (foundedIndex > -1 && listOfData[foundedIndex] != null) ? listOfData[foundedIndex].toString() : null)
          // console.log('aaaaaA', a)
          if (a != null)
            isComplyIcon.push(a)
        }
      }
      else if (item.type === "MULTIVALUE" && foundedIndex > -1) {
        if (listOfData[foundedIndex] != '' && listOfData[foundedIndex] != null) {
          var a = getStatusMultivalueForMainItem(item?.values, (foundedIndex > -1 && listOfData[foundedIndex] != null) ? listOfData[foundedIndex].toString() : null)
          // console.log('aaaaaA', a)
          if (a != null)
            isComplyIcon.push(a)
        }
      }
      else if (item.type === "MULTISELECT" && foundedIndex > -1) {
        if (listOfData[foundedIndex] != '' && listOfData[foundedIndex] != null) {
          var a = getStatusOfInputForMainItem(item?.values, (foundedIndex > -1 && listOfData[foundedIndex] != null) ? listOfData[foundedIndex].toString() : null)
          // console.log('aaaaaA', a)
          if (a != null)
            isComplyIcon.push(a)
        }
      }
      else if (item.parameterName != "TEXT" && item?.comply === true && foundedIndex > -1) {
        if (listOfData[foundedIndex] === item?.value) {
          isComplyIcon.push(a)
        }
        else {
          isComplyIcon.push(false)
        }
      }
      else if (item.parameterName != "NUMERIC" && item?.comply === true && foundedIndex > -1) {
        const valueNum = parseInt((listOfData[foundedIndex] || ''), 10);
        if (Number.isNaN(valueNum)) isComplyIcon.push(false)

        isComplyIcon.push(parseInt(item.minValue, 10) <= valueNum && parseInt(item.maxValue, 10) >= valueNum)
      }

      // else if (item.parameterName != "Files" && item.parameterName != "Signature" && item?.comply != null && item?.type != 'FREQUENCY' && foundedIndex > -1) {
      //   if (listOfData[foundedIndex] != '' && listOfData[foundedIndex] != null) {
      //     console.log('ANAF', item, item?.placeHolder)
      //     if (item?.placeHolder === item?.value) {
      //       isComplyIcon.push(a)
      //     }
      //     else {
      //       isComplyIcon.push(false)
      //     }
      //   }
      // }

    });
    let isShowing = null
    if (isComplyIcon.length > 0) {
      isShowing = isComplyIcon.every(v => v === isComplyIcon[0]);
    }
    console.log('isAComplyIcon', isComplyIcon, isShowing)
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.itemStyle}
        onPress={() => {
          setActiveIndex(index);
          setFileList([])
          // console.log('JSON.parse', JSON.parse(item?.formTemplate.content))
          const listOfFields = JSON.parse(item?.formTemplate.content);
          const listOfValue = JSON.parse(item?.formValues) || {};
          const listOfKeys = Object.keys(listOfValue);
          const listOfData = Object.values(listOfValue);
          // console.log('JSON.parse-Form-value', JSON.parse(item?.formValues))

          listOfFields.map((item, index) => {
            const foundedIndex = listOfKeys.indexOf(item.parameterName);
            if (item.parameterName === "Signature" && foundedIndex > -1) {
              if (listOfData[foundedIndex] != null) {
                downloadRequest({
                  variables: {
                    fileId: listOfData[foundedIndex].toString(),
                  },
                });
              }
            }
            if (item.parameterName === 'Files' && foundedIndex > -1) {
              setRecursionList(listOfData[foundedIndex])
              nextDownload(listOfData[foundedIndex], 0)
              // console.log('filesMyREport', listOfData[foundedIndex])
            }

            listOfValues.push({
              ...item,
              placeHolder: (item?.value != null || item?.value != undefined) ? item?.value : '',
              value:
                foundedIndex > -1 && listOfData[foundedIndex] != null
                  ? listOfData[foundedIndex].toString()
                  : null,
            });

          });
          setSelectItem(listOfValues);
          // console.log('item selecteded', listOfValues);
          // console.log('item selected', item);

        }}
      >
        <View style={styles.accordianContainer}>
          <View style={{ width: "40%" }}>
            <Text style={styles.assetName}>
              {item.asset.name + " - " + categoryNameChanger(item.asset.type)}
            </Text>
            <Text
              style={[styles.assetName, { color: colors.grey, fontSize: 12 }]}
            >
              {item.asset.system.type.charAt(0).toUpperCase() + item.asset.system.type.slice(1).toLowerCase()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* <Text style={styles.completedTaskHeading}>{'0/3'}</Text> */}
            {isShowing != null &&
              <Image style={[styles.complyIcon]} source={isShowing === true ? icons.complyIcon : icons.nonCompliantIcon} />
            }
            <Image
              style={[
                styles.iconStyleAccordian,
                {
                  transform: [
                    { rotate: index === activeIndex ? "0deg" : "180deg" },
                  ],
                },
              ]}
              source={icons.downArrowIcon}
            />
          </View>
        </View>
        {index == activeIndex && isEmptyAllValues(selectItem) === true ?

          <View style={{ padding: 15, backgroundColor: "#F3F4F9" }}>
            <Text style={[styles.lightText, { marginTop: 0 }]}>
              Noting filled in the form yet
            </Text>
          </View>
          :
          <Pressable>
            {index == activeIndex && selectItem?.length > 0 &&
              <View style={{ padding: 15, backgroundColor: "#F3F4F9" }}>
                <View>
                  <Text style={styles.lightText}>
                    {"Inspector"}
                  </Text>
                  <Text style={styles.darkText}>{userObjectQuery?.user?.name}</Text>

                </View>
                {selectItem?.map((element, index) => {
                  // console.log(element?.parameterName, element?.value);
                  if (
                    element?.value != null && element?.value != '' &&
                    element?.parameterName === "Signature"
                  ) {
                    return (
                      <View>
                        <Text style={styles.lightText}>
                          {element?.parameterName}
                        </Text>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: 25, marginBottom: 15 }}
                          onPress={() => {
                            setShowViewer(true)
                            setSelectedImageUri(signaturePicture)
                          }}
                        >
                          <AvatarComponent
                            imageStyle={[styles.fileTumbnail, { width: 47, height: 40 }]}
                            source={signaturePicture}
                            size={'small'}
                          />

                        </TouchableOpacity>
                      </View>
                    );
                  }

                  else if (
                    element.value != null && element.value != '' &&
                    element.parameterName === "Files"
                  ) {
                    return (
                      <View>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View key={element.key} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
                          <View key={element?.key} style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                            {fileList?.length > 0 &&
                              fileList?.map((element) => {
                                if (isImage(element?.downloadedUrl)) {
                                  // console.log('element', element)
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (isImage(element?.downloadedUrl)) {
                                          setShowViewer(true)
                                          setSelectedImageUri(element?.downloadedUrl)
                                        } else {
                                          setLoading(true)
                                          setShowViewer(false);
                                          dowloadFunction(element?.downloadedUrl)
                                        }
                                      }}
                                    >
                                      <AvatarComponent
                                        imageStyle={[styles.fileTumbnail, { width: 47, height: 40, marginLeft: 10, marginBottom: 10 }]}
                                        source={element?.downloadedUrl}
                                        defaultSource={icons.pdfIcon}
                                        size={'small'}
                                      />
                                    </TouchableOpacity>
                                  );
                                }
                                else {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (isImage(element?.downloadedUrl)) {
                                          setShowViewer(true)
                                          setSelectedImageUri(element?.downloadedUrl)
                                        } else {
                                          setLoading(true)
                                          setShowViewer(false);
                                          dowloadFunction(element?.downloadedUrl)
                                        }
                                      }}
                                      style={{
                                        width: 47, height: 40, marginLeft: 10, marginBottom: 10,
                                        backgroundColor: colors.fileColor, alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <Text>{element?.downloadedUrl?.split('.').pop()}</Text>
                                    </TouchableOpacity>
                                  )
                                }
                              })}
                          </View>
                        </View>

                      </View>
                    );
                  }
                  else if (
                    element.value != null && element.value != '' &&
                    element.type === "BOOLEAN"
                  ) {
                    return (
                      <>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.darkText}>{element.value}</Text>
                          {getStatusMultivalue(element?.values, element?.value)}
                        </View>
                      </>
                    );
                  }
                  else if (
                    element.value != null && element.value != '' &&
                    element.type === "MULTIVALUE"
                  ) {
                    return (
                      <>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.darkText}>{element.value}</Text>
                          {getStatusMultivalue(element?.values, element?.value)}
                        </View>
                      </>
                    );
                  }
                  else if (
                    element.value != null && element.value != '' &&
                    element.type === "MULTISELECT"
                  ) {
                    return (
                      <>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.darkText}>{element?.value}</Text>
                          {getStatusOfInput(element?.values, element?.value)}
                        </View>
                      </>
                    );
                  }


                  else if (element.type === "TEXT" && element.value != null && element.value != '') {
                    return (
                      <>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.darkText}>{element.value}</Text>
                          {element?.comply === true &&
                            <Image
                              style={styles.comlianceStyle}
                              source={element?.placeHolder === element?.value ?
                                icons.complyIcon : icons.nonCompliantIcon}
                            />
                          }
                        </View>
                      </>
                    );
                  }
                  else if (element.type === "DATE" && element.value != null && element.value != '') {
                    return (
                      <>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.darkText}>{moment(element.value).format('DD/MM/YYYY')}</Text>
                          {/* {element?.comply === true &&
                            <Image
                              style={styles.comlianceStyle}
                              source={element?.placeHolder === element?.value ?
                                icons.complyIcon : icons.nonCompliantIcon}
                            />
                          } */}
                        </View>
                      </>
                    );
                  }
                  else if (element.type === "NUMERIC" && element.value != null && element.value != '') {
                  
                    return (
                      <>
                        <Text style={styles.lightText}>
                          {element.parameterName}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.darkText}>{element.value}</Text>
                          {element?.comply === true &&
                            <Image
                              style={styles.comlianceStyle}
                              source={parseInt(element.minValue, 10) <= parseInt(element.value) && parseInt(element.maxValue, 10) >= parseInt(element.value) ?
                                icons.complyIcon : icons.nonCompliantIcon}
                            />
                          }
                        </View>
                      </>
                    );
                  
                  }





                  // else if (
                  //   element.value != null && element.value != '' &&
                  //   element.parameterName != "Files"
                  // ) {
                  //   return (
                  //     <>
                  //       <Text style={styles.lightText}>
                  //         {element.parameterName}
                  //       </Text>
                  //       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  //         <Text style={styles.darkText}>{element.value}</Text>
                  //         {element?.comply != null &&
                  //           <Image
                  //             style={styles.comlianceStyle}
                  //             source={element?.placeHolder === element?.value ?
                  //               icons.complyIcon : icons.nonCompliantIcon}
                  //           />
                  //         }
                  //       </View>
                  //     </>
                  //   );
                  // }

                })}
              </View>
            }
          </Pressable>
        }

      </TouchableOpacity>
    );
  };
  const getStatusOfInput = (_selectedList, selectedOutput) => {
    // console.log('_selectedList', _selectedList, selectedOutput)
    const selectedList = selectedOutput.split(',')
    if (_selectedList.length > 0) {
      let isComply = true
      for (const iterator of selectedList) {
        let filterdList = _selectedList.filter((element) => iterator == element?.value)
        if (filterdList.length > 0 && filterdList[0].comply != true) {
          isComply = false
          break;
        }
      }
      return (
        <Image
          style={styles.comlianceStyle}
          source={isComply ?
            icons.complyIcon
            : icons.nonCompliantIcon
          }
        />
      )
    } else return null
  }
  const onRefresh = () => {
    refetchReport({ variables: { id: selectedWorkCategoryTopBar.id } });
  };
  return (
    <SafeAreaView style={styles.safeStyle}>
      <TouchableOpacity
        onPress={() => {
          setPickerShow(true);
        }}
        style={styles.pickerContainer}
      >
        <Text style={styles.pickerText}>{selectAllAssetType}</Text>
        <Image source={icons.dropDownIcon} style={styles.pickerImage} />
      </TouchableOpacity>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.mainContainer}>
          <FlatList
            //  refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //   />
            // }

            data={filterList}
            renderItem={renderAccordianItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              width: "100%",
              marginBottom: 20,
              paddingBottom: 100,
            }}
            bounces={false}
            keyboardShouldPersistTaps={"handled"}
          />
        </View>
      </KeyboardAwareScrollView>
      <PickerModal
        modalVisible={isPickerShow}
        backBtnClick={() => {
          setPickerShow(false);
        }}
        list={selectAllAssets}
        onItemClickAction={(value) => {
          setPickerShow(false);
          setSelectAllAssetType(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
          // setSelectAllAssetType(value);
          // console.log(value);
          var data = reporteData?.task.assets.filter(function (item) {
            return item.asset?.system.type.charAt(0).toUpperCase() + item.asset?.system.type.slice(1).toLowerCase() === value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            // return item.asset?.system.type == value;
          });
          setFilterList(data);
        }}
      />
      <ImageViewer
        modalVisible={isShowViewer}
        backBtnClick={() => {
          setShowViewer(false);
        }}
        downloadBtnClick={() => {
          setLoading(true)
          setShowViewer(false);
          dowloadFunction(selectedImageUri)
        }}
        imageUri={selectedImageUri}
      />

      <Loader loading={reportLoading || loading} isShowIndicator={true} />
    </SafeAreaView>
  );
};
export default ReportWorkTopBar;
