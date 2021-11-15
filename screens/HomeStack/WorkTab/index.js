import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import {
  setOngoingStatus,
  setSelectedWorkCategoryTopBar,
  setUserObjectQuery,
  setIsAdhoc
} from "../../../store/actions/generalParam";
import icons from "./../../../assets/icons/";
import PickerModal from "./../../../components/PickerModal";
import strings from "./../../../locales/en.json";
import colors from "./../../../utils/colors";
import { styles } from "./Styles";

const ALL_DATA = gql`
  query tasksForOperative(
    $userId: ID!
    $dayDateRange: DayDateRange
    $type: TaskType
    $urgent: Boolean
    $withoutRequests: Boolean
    $withoutRejected: Boolean
  ) {
    user(id: $userId) {
      id
      tasks(
        dayDateRange: $dayDateRange
        type: $type
        urgent: $urgent
        withoutRequests: $withoutRequests
        withoutRejected: $withoutRejected
      ) {
        id
        type
        notes
        adhoc
        deadline
        status
        site {
          id
          companyName
          __typename
        }
        assetsCount
        urgent
        compliant
        __typename
      }
      clients {
        id
        companyName
        __typename
      }
      __typename
    }
  }
`;
const USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phonenumber
      role
      isAdmin
      fullAccess
      adhoc
      notificationSchedule
      notificationStatus
      sites {
        id
        __typename
      }
      picture {
        id
        srcUrl
        __typename
      }
      company {
        id
        name
        __typename
      }
      __typename
    }
  }
`;
const USER_SITES = gql`
  query userSites($id: ID!) {
    user(id: $id) {
      id
      sites {
        id
        name
        __typename
      }
      __typename
    }
  }
`;
const TASK_CREATE_MY_SELF = gql`
  mutation taskCreateMyself($task: TaskCreateInput!) {
    taskCreate(task: $task) {
      id
    }
  }
`;

const WorkTab = (props) => {
  const { navigation } = props;
  const { category, userObjectQuery } = useSelector(
    (state) => state.generalParam
  );
  console.log("🚀 ~ file: index.js ~ line 126 ~ WorkTab ~ category", category);
  const { currentUser } = useSelector((state) => state.userSession);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [newAddHoc, setNewAddHoc] = useState("");
  const userId = currentUser?.id || "";

  const [date, setDate] = useState(new Date());
  const [variableObject, setVariableObject] = useState({
    userId: currentUser?.id,
    withoutRejected: true,
    withoutRequests: true,
    urgent: false,
    dayDateRange: {
      minDayDate: moment(date, "YYYY-MM-DD").startOf("week").format("YYYY-MM-DD"),
      maxDayDate: moment(date, "YYYY-MM-DD").endOf("week").format("YYYY-MM-DD"),
      // "minDayDate": moment(date, 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD'),
      // "maxDayDate": moment(date).format('YYYY-MM-DD')
    },
  });
  const [getWork, { loading: getDataLoading, error, data }] = useLazyQuery(
    ALL_DATA,
    { fetchPolicy: "no-cache" }
  );

  const {
    loading: getUserLoading,
    error: getUserError,
    data: getUserData,
  } = useQuery(USER, { variables: { id: currentUser?.id } });
  // console.log('Work', 'getUserLoading', getUserLoading, 'getUserError', getUserError, 'getUserData', getUserData)

  const [
    getSites,
    { loading: userSiteLoading, error: userSiteError, data: userSiteData },
  ] = useLazyQuery(USER_SITES, { fetchPolicy: "no-cache" });
  console.log(
    "Work",
    "userSiteLoading",
    userSiteLoading,
    "userSiteError",
    userSiteError,
    "userSiteData",
    userSiteData
  );

  const [
    createMySelfFunction,
    {
      data: createMySelfData,
      loading: createMySelfLoading,
      error: createMySelfError,
    },
  ] = useMutation(TASK_CREATE_MY_SELF, {
    refetchQueries: [
      {
        query: ALL_DATA,
        variables: variableObject,
      },
    ],
  });
  // console.log('createMySelfFunction', 'createMySelfLoading', createMySelfLoading, 'createMySelfError', createMySelfError, 'createMySelfData', createMySelfData)

  const [isWeekly, setIsWeekly] = useState(true);
  const [isPickerShow, setPickerShow] = useState(false);
  const [isPickerShowAllTask, setIsPickerShowAllTask] = useState(false);
  const [isPickerShowPriority, setIsPickerShowPriority] = useState(false);
  const [selectPlusCategory, setSelectPlusCategory] = useState("Audit");
  const [selectTaskTypes, setSelectTaskTypes] = useState("All task types");
  const [selectPriorityList, setSelectPriorityList] = useState("All Priority");
  const [dateMonth, setDateMonth] = useState(moment());
  const [workList, setWorkList] = useState([]);
  console.log("🚀 ~ file: index.js ~ line 204 ~ WorkTab ~ workList", workList)
  const [siteId, setSiteId] = useState([]);

  const [selectTopCategory, setSelectTopCategory] = useState([
    { name: "Audit", queryName: "AUDIT", id: 1 },
    { name: "Compliance check", queryName: "COMPLIANCE_CHECK", id: 2 },
    { name: "Other", queryName: "OTHER", id: 3 },
    { name: "Repair work", queryName: "REPAIR", id: 4 },
    { name: "Sampling", queryName: "SAMPLING", id: 5 },
    { name: "Survey", queryName: "SURVEY", id: 6 },
    { name: "Testing", queryName: "TESTING", id: 7 },
  ]);
  const [taskTypes, setTaskTypes] = useState([
    { name: "All task types", id: 1, queryValue: "All task types" },
    { name: "Audit", id: 2, queryValue: "AUDIT" },
    { name: "Compliance check", id: 3, queryValue: "COMPLIANCE_CHECK" },
    { name: "Other", id: 4, queryValue: "OTHER" },
    { name: "Repair work", id: 5, queryValue: "REPAIR" },
    { name: "Sampling", id: 6, queryValue: "SAMPLING" },
    { name: "Survey", id: 7, queryValue: "SURVEY" },
    { name: "Testing", id: 8, queryValue: "TESTING" },
  ]);
  const [priorityList, setPriorityList] = useState([
    { name: "Only Urgents", id: 1, isUrgent: true },
    { name: "All Priority", id: 2, isUrgent: false },
  ]);
  const PickerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("categorycategorycategory", category, userObjectQuery);
      console.log("focus work tab");

      setDate(new Date())
      setDateMonth(moment())
      setIsWeekly(true)
      setSelectTaskTypes("All task types")
      setSelectPriorityList("All Priority")

      getSites({ variables: { id: currentUser?.id } });
      var queryObject = {
        userId: userId,
        withoutRejected: true,
        withoutRequests: true,
        urgent: false,
      };
      queryObject.dayDateRange = {
        minDayDate: moment(date, "YYYY-MM-DD").startOf("week"),
        maxDayDate: moment(date, "YYYY-MM-DD").endOf("week"),
        // minDayDate: moment(date, "YYYY-MM-DD").startOf("month"),
        // maxDayDate: moment(date, "YYYY-MM-DD").endOf("month"),
      };
      setVariableObject(queryObject);
      getWork({
        variables: queryObject,
      });
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    if (userSiteData) {
      console.log("hassan", userSiteData?.user?.sites[0]?.id);
      setSiteId(userSiteData);
    }
  }, [userSiteData]);
  useEffect(() => {
    console.log("work dataChange");
    setWorkList(data?.user?.tasks);
    if (newAddHoc != "") {
      var dataItem = data?.user?.tasks.filter(function (item) {
        return item?.id == newAddHoc;
      });
      if (dataItem?.length > 0) {
        setNewAddHoc("");
        dispatch(setSelectedWorkCategoryTopBar(dataItem[0]));
        dispatch(setOngoingStatus(dataItem[0].status));
        navigation.push("HomeDrawerStack", {
          screen: "WorkTopBarContainer",
          params: {
            headerName: categoryNameSelection(dataItem[0]),
          }
        });
        // navigation.navigate("WorkTopBarContainer", {
        //   headerName: categoryNameSelection(dataItem[0]),
        // });
      }
      // console.log('dataItem',dataItem[0])
    }
  }, [data]);
  useEffect(() => {
    if (getUserData) {
      dispatch(setUserObjectQuery(getUserData));
      console.log('getUserData', getUserData)
      // setIsTechncian(getUserData?.role==='CONTRACTOR_TECHNICIAN' ? true :false)
      // console.log('call-role', getUserData?.user?.role)
    }
  }, [getUserData]);
  useEffect(() => {
    if (createMySelfData) {
      console.log("createMySelfData", createMySelfData?.taskCreate?.id);
      setNewAddHoc(createMySelfData?.taskCreate?.id);
      dispatch(setIsAdhoc(true))
      getWork({
        variables: variableObject,
      });
    }
  }, [createMySelfData]);
  const onBranchSelected = (value) => {
    setSelected(value);
  };
  const categoryNameSelection = (item) => {
    if (item.type === "TESTING") {
      return "Testing";
    } else if (item.type === "COMPLIANCE_CHECK") {
      return "Compliance Check";
    } else if (item.type === "OTHER") {
      return "Other";
    } else if (item.type === "SAMPLING") {
      return "Sampling";
    } else if (item.type === "AUDIT") {
      return "Audit";
    } else if (item.type === "REPAIR") {
      return "Repair";
    } else if (item.type === "SURVEY") {
      return "Survey";
    } else {
      return "Sampling";
    }
  };
  const renderNewWorkItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // console.log("my item ", item);
          dispatch(setSelectedWorkCategoryTopBar(item));
          dispatch(setIsAdhoc(item.adhoc))
          dispatch(setOngoingStatus(item.status));
          navigation.push("HomeDrawerStack", {
            screen: "WorkTopBarContainer",
            params: {
              headerName: categoryNameSelection(item),
            }
          });
        }}
        style={[
          styles.itemMainContainer,
          {
            backgroundColor:
              item.status === "SUPP_INFO_SUBMITTED"
                ? colors.lightGrey
                : colors.white,
            borderStartColor:
              item.status === "SUPP_INFO_SUBMITTED"
                ? colors.grey
                : colors.green,
          },
        ]}
      >
        <View style={styles.itemLeftImageContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                item.type === "TESTING"
                  ? icons.testingIcon
                  : item.type === "COMPLIANCE_CHECK"
                    ? icons.complianceIcon
                    : item.type === "OTHER"
                      ? icons.otherTaskIcon
                      : item.type === "SAMPLING"
                        ? icons.testTubeIcon
                        : item.type === "AUDIT"
                          ? icons.auditIcon
                          : item.type === "REPAIR"
                            ? icons.repairIcon
                            : icons.surveyIcon
              }
              style={styles.leftImage}
            />
          </View>
          {item.adhoc && (
            <View style={styles.adhocContainer}>
              <Text style={styles.adhocText}>A</Text>
            </View>
          )}
        </View>
        <View style={styles.itemRightMain}>
          <View style={styles.itemTitle}>
            <Text style={styles.titleStyle}>
              {strings.task_types[item.type] || item.type}
            </Text>
            <View style={styles.workStatuses}>
              {item.compliant === true ? (
                <Image source={icons.complyIcon} style={styles.complyImg} />
              ) : null}
              {item.compliant === false ? (
                <Image source={icons.nonCompliantIcon} style={styles.complyImg} />
              ) : null}
              {item.urgent ? (
                <Image source={icons.urgentIcon} style={styles.urgentIcon} />
              ) : null}
            </View>
          </View>
          <View style={styles.assetNoContainer}>
            <Text style={styles.noAssetStyle}>{"Works D/L"}</Text>
            <Text style={styles.remainingDaysStyle}>
              {" "}
              {moment(item.deadline).format("MMMM DD, YYYY")}
            </Text>
          </View>
          <View style={styles.assetNoContainer}>
            <Text style={styles.noAssetStyle}>{"No of Assets"}</Text>
            <Text style={styles.noAssetStyle}>{item.assetsCount}</Text>
          </View>

          <Text style={[styles.demoClientStyle]}>{item.site.companyName}</Text>

          {item?.notes != null && (
            <View
              style={[
                styles.assetNoContainer,
                { width: "70%", justifyContent: null, alignItems: null },
              ]}
            >
              <Text style={styles.noAssetStyle}>{"Notes: "}</Text>
              <Text style={[styles.noAssetStyle, { width: "80%" }]}>
                {item?.notes}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const renderEmptyContainer = () => {
    if (getDataLoading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {strings.work_tab.no_work_list_yet}
        </Text>
      </View>
    );
  };
  const onRefresh = () => {
    setDate(new Date())
    setDateMonth(moment())
    setIsWeekly(true)
    setSelectTaskTypes("All task types")
    setSelectPriorityList("All Priority")
    var resetObject = {
      userId: currentUser?.id,
      withoutRejected: true,
      withoutRequests: true,
      urgent: false,
      dayDateRange: {
        minDayDate: moment(date, "YYYY-MM-DD").startOf("week").format("YYYY-MM-DD"),
        maxDayDate: moment(date, "YYYY-MM-DD").endOf("week").format("YYYY-MM-DD"),
      }
    }
    setVariableObject(resetObject)
    getWork({
      variables: resetObject,
    });
  };
  return (
    <SafeAreaView style={styles.safeStyle}>
      <Header
        containerStyle={{ backgroundColor: colors.green }}
        // leftIcon={icons.backIcon}
        rightIcon={icons.logoIcon}
        hearderText={strings.work_tab.work_instruction}
        leftButtonIconStyle={{ width: 22, height: 22, tintColor: colors.white }}
        rightText={userObjectQuery?.user?.name[0]}
        onRightAction={() => {
          navigation.toggleDrawer();
        }}
      />
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {siteId?.user?.sites[0]?.id && (
          <View style={{ alignItems: "center", width: "100%", height: "100%" }}>
            <View style={styles.topMainBarContainer}>
              {userObjectQuery?.user?.role !== "CONTRACTOR_TECHNICIAN" &&
                userObjectQuery?.user?.adhoc === true && (
                  <TouchableOpacity
                    onPress={() => {
                      setPickerShow(true);
                    }}
                    style={styles.plusBtnContainer}
                  >
                    <Image source={icons.plusIcon} style={styles.plusImage} />
                  </TouchableOpacity>
                )}
              <View style={styles.barContainerInner}>
                <TouchableOpacity
                  onPress={() => {
                    !isWeekly && setIsWeekly(!isWeekly);
                    // if (selectTaskTypes != "All task types") {
                    //   queryObject.type = selectTaskTypes;
                    // }
                    var queryObject = variableObject;
                    queryObject.dayDateRange = {
                      minDayDate: moment(date, "YYYY-MM-DD").startOf("week"),
                      maxDayDate: moment(date, "YYYY-MM-DD").endOf("week"),
                    }
                    setVariableObject(queryObject);
                    getWork({
                      variables: queryObject,
                    });
                  }}
                  style={[
                    styles.topBtnContainer,
                    { backgroundColor: isWeekly ? colors.green : colors.white },
                  ]}
                >
                  <Text
                    style={[
                      styles.barText,
                      { color: isWeekly ? colors.white : colors.black },
                    ]}
                  >
                    {strings.work_tab.weekly}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    isWeekly && setIsWeekly(!isWeekly);
                    var minDate = moment(dateMonth).startOf(
                      "month"
                    ).format("DD MMM YYYY");
                    var maxDate = moment(dateMonth).endOf(
                      "month"
                    ).format("DD MMM YYYY");

                    var queryObject = variableObject;
                    queryObject.dayDateRange = {
                      minDayDate: minDate,
                      maxDayDate: maxDate,
                    }
                    // if (selectTaskTypes != "All task types") {
                    //   queryObject.type = selectTaskTypes;
                    // }
                    setVariableObject(queryObject);
                    getWork({
                      variables: queryObject,
                    });
                  }}
                  style={[
                    styles.topBtnContainer,
                    {
                      backgroundColor: !isWeekly ? colors.green : colors.white,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.barText,
                      { color: !isWeekly ? colors.white : colors.black },
                    ]}
                  >
                    {strings.work_tab.monthly}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.pickerMainContainer}>
              <View style={[styles.pickerContainer, { width: "100%" }]}>
                <TouchableOpacity
                  style={styles.sideCalandarTouch}
                  onPress={() => {
                    if (isWeekly) {
                      var queryObject = variableObject;
                      // if (selectTaskTypes != "All task types") {
                      //   queryObject.type = selectTaskTypes;
                      // }
                      queryObject.dayDateRange = {
                        minDayDate: moment(date, "YYYY-MM-DD").subtract(7, "days").startOf("week"),
                        maxDayDate: moment(date, "YYYY-MM-DD").subtract(7, "days").endOf("week"),
                      }
                      setVariableObject(queryObject);
                      getWork({
                        variables: queryObject,
                      });
                      setDate(moment(date, "DD MMM YYYY").subtract(7, "days"));
                    } else {

                      var minDate = moment(dateMonth)
                        .subtract(1, "M")
                        .startOf("month").format("DD MMM YYYY");
                      var maxDate = moment(dateMonth)
                        .subtract(1, "M")
                        .endOf("month").format("DD MMM YYYY");



                      var queryObject = variableObject;
                      queryObject.dayDateRange = {
                        minDayDate: minDate,
                        maxDayDate: maxDate
                      }
                      // console.log('selectTaskTypes', selectTaskTypes)
                      // if (selectTaskTypes != "All task types") {
                      //   queryObject.type = selectTaskTypes;
                      // }
                      setVariableObject(queryObject);
                      getWork({
                        variables: queryObject,
                      });
                      setDateMonth(
                        moment(dateMonth).subtract(1, "M")
                      );
                      console.log(
                        "subtract DateMonth",
                        moment(dateMonth)
                          .subtract(1, "M")
                          .startOf("month")
                      );
                    }
                  }}
                >
                  <Image
                    source={icons.dropDownIcon}
                    style={styles.calandarLeftSideImage}
                  />
                </TouchableOpacity>
                <Text style={[styles.pickerText, { textAlign: "center" }]}>
                  {isWeekly
                    ? moment(date, "DD MMM YYYY")
                      .startOf("week")
                      .format("DD MMM YYYY") +
                    " - " +
                    moment(date).endOf("week").format("DD MMM YYYY")
                    : moment(dateMonth).format("MMMM YYYY")}
                </Text>
                <TouchableOpacity
                  style={styles.sideCalandarTouch}
                  onPress={() => {
                    if (isWeekly) {


                      var queryObject = variableObject;
                      queryObject.dayDateRange = {
                        minDayDate: moment(date, "YYYY-MM-DD").add(7, "days").startOf("week"),
                        maxDayDate: moment(date, "YYYY-MM-DD").add(7, "days").endOf("week")
                      }
                      // if (selectTaskTypes != "All task types") {
                      //   queryObject.type = selectTaskTypes;
                      // }
                      setVariableObject(queryObject);
                      getWork({
                        variables: queryObject,
                      });
                      setDate(moment(date, "DD MMM YYYY").add(7, "days"));
                    } else {


                      var minDate = moment(dateMonth)
                        .add(1, "M")
                        .startOf("month").format("DD MMM YYYY");
                      var maxDate = moment(dateMonth)
                        .add(1, "M")
                        .endOf("month").format("DD MMM YYYY");





                      var queryObject = variableObject;
                      queryObject.dayDateRange = {
                        minDayDate: minDate,
                        maxDayDate: maxDate,
                      }
                      // if (selectTaskTypes != "All task types") {
                      //   queryObject.type = selectTaskTypes;
                      // }
                      setVariableObject(queryObject);
                      getWork({
                        variables: queryObject,
                      });
                      setDateMonth(
                        moment(dateMonth)
                          .add(1, "M")
                      );
                      console.log(
                        "add DateMonth",
                        moment(dateMonth)
                          .startOf("month")
                          .add(1, "M")
                          .format("YYYY-MM-DD")
                      );
                    }
                  }}
                >
                  <Image
                    source={icons.dropDownIcon}
                    style={styles.calandarRightSideImage}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pickerMainContainer}>
              <TouchableOpacity
                onPress={() => {
                  setIsPickerShowAllTask(true);
                }}
                style={styles.pickerContainer}
              >
                <Text style={styles.pickerText}>{selectTaskTypes}</Text>
                <Image source={icons.dropDownIcon} style={styles.pickerImage} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsPickerShowPriority(true);
                }}
                style={styles.pickerContainer}
              >
                <Text style={styles.pickerText}>{selectPriorityList}</Text>
                <Image source={icons.dropDownIcon} style={styles.pickerImage} />
              </TouchableOpacity>
            </View>

            <View
              style={{ alignItems: "center", width: "100%", height: "100%" }}
            >
              <View style={styles.flatListContainer}>
                <FlatList
                  data={workList}
                  listKey={moment().format("x").toString()}
                  keyExtractor={(item, index) => `${item.id}_${index}`}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 140 }}
                  renderItem={renderNewWorkItem}
                  ListEmptyComponent={renderEmptyContainer}
                />
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>

      <PickerModal
        modalVisible={isPickerShow}
        backBtnClick={() => {
          setPickerShow(false);
        }}
        list={selectTopCategory}
        onItemClickAction={(value) => {
          setPickerShow(false);
          setSelectPlusCategory(value.name);
          console.log(value);
          createMySelfFunction({
            variables: {
              task: {
                siteId: siteId?.user?.sites[0]?.id,
                assetIds: [],
                type: value.queryName.toUpperCase(),
                approvalUserId: currentUser?.id,
                documentDeadline: moment(new Date()).format("YYYY-MM-DD"),
                deadline: moment(new Date()).format("YYYY-MM-DD"),
                fileIds: [],
                internalUserId: currentUser?.id,
                adhoc: true
              },
            },
          });
        }}
      />
      <PickerModal
        modalVisible={isPickerShowAllTask}
        backBtnClick={() => {
          setIsPickerShowAllTask(false);
        }}
        list={taskTypes}
        onItemClickAction={(value) => {
          setIsPickerShowAllTask(false);
          setSelectTaskTypes(strings.task_types[value.queryValue]);
          console.log(value);
          var queryObject = variableObject;
           if (value.queryValue != "All task types") {
            queryObject.type = value.queryValue
          }
          else[
            queryObject.type = null
          ]
          setVariableObject(queryObject);
          getWork({
            variables: queryObject,
          });
        }}
      />
      <PickerModal
        modalVisible={isPickerShowPriority}
        backBtnClick={() => {
          setIsPickerShowPriority(false);
        }}
        list={priorityList}
        onItemClickAction={(value) => {
          setIsPickerShowPriority(false);
          setSelectPriorityList(value.name);
          console.log(value);
        
          var queryObject = variableObject;
          queryObject.urgent = value.isUrgent
          setVariableObject(queryObject);
          getWork({
            variables: queryObject,
          });
        }}
      />
      <Loader loading={getDataLoading} isShowIndicator={true} />
      <Loader loading={getUserLoading} isShowIndicator={true} />
      <Loader loading={createMySelfLoading} isShowIndicator={true} />
    </SafeAreaView>
  );
};
export default WorkTab;
