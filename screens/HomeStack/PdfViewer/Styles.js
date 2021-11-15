import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors'
const { width, height } = Dimensions.get('window')
import { StatusBarHeight } from '../../../utils/Dimensions'

export const styles = StyleSheet.create({
  safeStyle: {
    flex: 1,
    marginTop: StatusBarHeight
  },
  modalContentContainer: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.white
  },
  removeIcon:{
    width:24,
    height:32,
    resizeMode:'contain'
  },
  crossStyle: {
    width: 20,
    height: 20,
    marginTop: 25,
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    tintColor: colors.grey
  },
  drawingContainer: {
    marginTop: 5,
    backgroundColor: colors.lightGrey,
    padding: 5,
    paddingTop: 10,
    width: '100%',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  drawingText: {
    color: colors.green,
    textDecorationLine: 'underline',
    fontFamily: fonts.Regular,
    width: '78%'
  },
  drawingTouch: {
    marginRight: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: .5,
    borderColor: colors.grey,
    alignItems: 'center',
    justifyContent: "center"
  },
  drawingIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain'
  },
  itemListHeading: {
    fontFamily: fonts.Bold,
    fontSize: 14,
    marginTop: 10,
  },
  itemListdetailText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: colors.grey,
    marginTop: 3,
    width: '100%',
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: StatusBarHeight,
    paddingHorizontal: 20,
  },
  topContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingLeft: 15,
    paddingRight: 15
  },
  topPdfPickerName: {
    width: '60%',
    textAlign: 'center',
    fontFamily: fonts.Regular,
    fontSize: 14,
    marginTop: 2
  },
  topnameContainer: {
    backgroundColor: '#F3F4F9',
    borderRadius: 15,
    height: 35,
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: 35,
    height: 35,
    resizeMode: 'contain'
  },
  rotationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    width: '80%',
    padding: 10,
    backgroundColor: colors.white,
    position: 'absolute',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    bottom: 30,
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  BottomHeading: {
    fontSize: 18,
    fontFamily: fonts.Bold
  },
  BottomTitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    marginTop: 10
  },
  BottomReadMore: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    marginTop: 5,
    color: colors.green
  },
  dropDownStyle:{
    width:10,
    height:10,
    resizeMode:'contain',
    marginLeft:7,
    position:'absolute',
    right:5
  }
});
