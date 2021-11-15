import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors'
const { width, height } = Dimensions.get('window')
export const styles = StyleSheet.create({
  safeStyle: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
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
  itemMainContainerByType: {
    width: '48%',
    padding: 12,
    marginTop: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.lightGrey
  },
  typeHeadingStyle: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: colors.grey,
    marginBottom: 5
  },
  flatListContainer: {
    marginHorizontal: 5,
    // backgroundColor:'red'
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
  leftImage: {
    width: 25,
    height: 25,
    resizeMode: 'stretch',
    tintColor: colors.green
  },
  urgentImage: {
    width: 20,
    height: 20,
    resizeMode: 'stretch',
  },
  calendarContainer: {
    flexDirection: 'row',
    // alignItems:'center',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: fonts.Bold,
    color: colors.black,
    marginBottom: 5
  },
  noAssetStyle: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: fonts.Regular,
  },
  workInstructionStyle: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: fonts.Regular,
    marginTop: 7
  },
  demoClientStyle: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.green,
    marginTop: 2
  },
  calendarImage: {
    width: 18,
    height: 18,
    resizeMode: 'stretch'
  },
  dateStyle: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: colors.grey,
    marginRight: 7,
    width: '77%',
    // backgroundColor:'red'
  },
  remainingDaysStyle: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: colors.grey,
  },
  emptyContainer: {
    width: '100%',
    height: height - 180,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: colors.black,
    textAlign:'center'
    // marginLeft: 7
  },
  assetNoContainer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
    // backgroundColor:'red'
  },
  itemRightMain: {

  },
  headingText: {
    color: colors.darkGrey,
    fontSize: 18,
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
    // marginBottom:8,
    fontFamily: fonts.Bold
  }
});
