import { Dimensions, StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors';
const {width,height}=Dimensions.get('window')
export const styles = StyleSheet.create({
  safeStyle: {
    flex: 1,
    alignItems: 'center'
  },
  container: {
    width:'100%',
    height:height-380,
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topMainBarContainer: {
    width: '100%',
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  plusBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 7,
    borderWidth: .8,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center'
  },
  adhocText:{
    color:colors.green,
    fontFamily:fonts.Bold,
    fontSize:14
  },
  plusImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.green
  },
  barContainerInner: {
    flexDirection: 'row',
    marginLeft: 10,
    width: '65%',
    height: 40,
    borderRadius: 7,
    borderColor: colors.grey,
    borderWidth: .8
  },
  topBtnContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 6
  },
  barText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: colors.black
  },
  pickerTopText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.black,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  },
  pickerMainContainer: {
    width: '90%',
    height: 42,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'red'
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '45%',
    padding: 10,
    borderRadius: 8,
    borderWidth: .8,
    borderColor: colors.grey
  },
  pickerText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.Regular,
    width:'80%',
    // textAlign:'center'
    // backgroundColor:'red'
  },
  pickerImage: {
    width: 14,
    height: 11,
    resizeMode: 'contain',
    tintColor: colors.green
  },
  calandarLeftSideImage: {
    width: 14,
    height: 11,
    resizeMode: 'contain',
    tintColor: colors.green,
    transform: [{ rotate: '90deg' }]
  },
  calandarRightSideImage: {
    width: 14,
    height: 11,
    resizeMode: 'contain',
    tintColor: colors.green,
    transform: [{ rotate: '270deg' }]
  },
  flatListContainer: {
    marginHorizontal: 5,
    // backgroundColor:'red'
  },
  itemMainContainer: {
    width: '92%',
    padding: 12,
    borderWidth: .8,
    borderLeftWidth: 10,
    borderColor: colors.grey,
    marginTop: 15,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    borderStartColor: colors.green,
  },
  imageContainer: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 13
  },
  adhocContainer: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 13,
    marginTop:10
  },
  itemLeftImageContainer:{
    alignItems:'center',
    justifyContent:'center'
  },
  leftImage: {
    width: 25,
    height: 25,
    resizeMode: 'stretch',
    tintColor: colors.green
  },
  itemRightMain: {},
  itemTitle:{
    width:'70%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    // backgroundColor:'red'
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: fonts.Bold,
    color: colors.black,
    marginBottom: 5,
    width:'70%'
  },
  complyImg:{
    width:12,
    height:16,
    marginLeft: 6
  },
  urgentIcon:{
    width:16,
    height:16,
    marginLeft: 6
  },
  assetNoContainer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    // backgroundColor:'red'
  },
  noAssetStyle: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: fonts.Regular,
  },
  remainingDaysStyle: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: colors.grey,
  },
  demoClientStyle: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.green,
    marginTop: 2
  },
  sideCalandarTouch: {
    width: 20,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyContainer: {
    width: width,
    height: height - 360,
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: colors.black,
    marginLeft: 7
  },
  workStatuses: {
    flexDirection: 'row'

  }
});
