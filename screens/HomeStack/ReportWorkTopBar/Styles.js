import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors'
const { width, height } = Dimensions.get('window')
export const styles = StyleSheet.create({
  safeStyle: {
    flex: 1,
  },
  complyIcon: {
    width: 24,
    height: 24,
    marginLeft: 7,
    resizeMode: 'contain',
  },
  yesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  complyInner: {
    width: 24,
    height: 22,
    resizeMode: 'contain'
  },
  signatureIcon: {
    width: 40,
    height: 40,
    marginTop: 10,
    resizeMode: 'contain'
  },
  addImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  fileTumbnail:{
    width:70,
    height:52,
    resizeMode:'stretch',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    height: 45,
    padding: 10,
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: .8,
    borderColor: colors.grey,
    marginTop: 15,
    marginBottom: 15
  },
  pickerText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.Regular,
  },
  pickerImage: {
    width: 14,
    height: 11,
    resizeMode: 'contain',
    tintColor: colors.green
  },
  addImageBtnToch: {
    flexDirection: 'row',
    marginTop: 15,
    flexWrap:'wrap',
    alignItems:'center'
  },
  itemStyle: {
    width: '100%',
    borderWidth: .7,
    borderBottomWidth: 0,
    borderColor: colors.grey,
    alignSelf: 'center',
  },
  accordianContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: .7,
    borderColor: colors.grey,
    // backgroundColor: '#F7F7F7',
    width: '100%',
    alignItems: 'center'
  },
  iconStyleAccordian: {
    width: 25,
    height: 22,
    resizeMode: 'contain',
    marginLeft: 7,
    tintColor: colors.black,
  },
  assetName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.Regular
  },
  assetCategory: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.grey
  },
  completedTaskHeading: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.grey
  },
  darkText: {
    fontFamily: fonts.Bold,
    fontSize: 14,
    // marginTop: 10,
    lineHeight: 24
  },
  lightText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    marginTop: 15,
    lineHeight: 24

  },
  comlianceStyle:{
    width:25,
    height:25,
    resizeMode:'contain'
  },
});
