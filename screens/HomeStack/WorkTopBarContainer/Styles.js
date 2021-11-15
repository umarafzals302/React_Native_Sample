import { StyleSheet } from 'react-native';
import fonts from './../../../assets/fonts/';
import Fonts from './../../../assets/fonts/'
import colors from './../../../utils/colors'
import { StatusBarHeight,isIPhoneX } from './../../../utils/Dimensions'

export const styles = StyleSheet.create({
  safeStyle: {
    flex: 1,
    paddingTop: StatusBarHeight,
    // alignItems:'center' ,
    // backgroundColor:colors.background,
    marginBottom:isIPhoneX()?20:0
  },
  timerContainer: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 18,
    paddingLeft: 18,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeHeading: {
    color: colors.black,
    fontFamily: fonts.Regular,
    fontSize: 12
  },
  timeStyle: {
    color: colors.black,
    fontFamily: fonts.Bold,
    fontSize: 18,
    marginTop: 8
  },
  btnStyle: {
    fontSize: 12,
    fontFamily: fonts.Bold,
    color: colors.white
  },
  rightContainer: {
    flexDirection: 'row',
    width: '60%',
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  playIconStyle: {
    width: 45,
    height: 45,
    resizeMode: 'contain'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  buttonStyle: {
    borderRadius: 8,
    width: '45%',
    height: 43,
    backgroundColor: colors.white,
    borderWidth: .8,
    borderColor: colors.red,
  },
  submittedText: {
    color: colors.green,
    fontFamily: fonts.Bold,
    fontSize: 14,
    marginLeft: 5
  },
  barContainerInner: {
    flexDirection: 'row',
    width: '75%',
    height: 45,
    borderRadius: 7,
    borderColor: colors.grey,
    borderWidth: 1,
    // marginTop: 15
  },
  topBtnContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  barText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: colors.black
  },
  searchInput: {
    height: 65,
    width: "75%",
    alignSelf: "center",
  },
  cancelBtnContainer: {
    width: '45%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.green,
    marginTop: 15
  },
  cancelText: {
    fontFamily: fonts.Regular,
    color: colors.green,
    fontSize: 16
  },
  startAssetStyle:{
    width:'60%',
    backgroundColor:colors.lightGrey,
    borderRadius:8,
    textAlign:'center',
    padding:8
  }
});
