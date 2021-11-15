import { StyleSheet } from 'react-native';
import colors from './../../../utils/colors'
import fonts from './../../../assets/fonts/index'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:25,
    marginTop:40
  },
  scrollingView: {
    flexGrow: 1,
    width: '100%'
  },
  safeStyle: {
    flex: 1,
    alignItems:'center' ,
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%',
    justifyContent:'center'
  },
  backTouch:{position:'absolute',left:0},
  backmage:{
    width:25,
    height:25,
    marginRight:20,
    resizeMode:'contain'
  },
  logoImage: {
    width: '60%',
    height: 65,
    resizeMode: 'contain',
    alignSelf:'center'
  },
  forgotHeading: {
    fontFamily: fonts.Bold,
    color: colors.black,
    fontSize: 24,
    marginTop:100
  },
  forgotDescription:{
    fontFamily: fonts.Regular,
    color: colors.black,
    fontSize: 18,
    marginBottom: 20,
    marginTop:20,
    lineHeight:25
  },
  btnStyle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.white
  },
  edacText: {
    alignSelf: 'center',
    marginTop:20,
    marginBottom: 20,
    fontSize: 16,
    color: colors.green,
    fontFamily: fonts.Regular,
   
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cancelBtn: {
    borderRadius: 14,
    marginTop: 33,
    width: '45%',
    backgroundColor: colors.white,
    borderWidth:1,
    borderColor:colors.green
  },
  sendBtn: {
    borderRadius: 14,
    marginTop: 33,
    width: '45%'
  }
});
