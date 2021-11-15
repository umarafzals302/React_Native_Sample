import { StyleSheet } from 'react-native';
import colors from './../../../utils/colors'
import fonts from './../../../assets/fonts/index'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
  scrollingView: {
    flexGrow: 1,
    width: '100%',
  },
  safeStyle: {
    flex: 1,
    // alignItems:'center' ,
    // justifyContent: 'center',
    width: '100%',
  },
 
  logoImage: {
    width: '60%',
    height: 67,
    resizeMode: 'contain',
    marginTop:120
  },
  animatedMainView: {
    width: '100%',
    padding: 25,
    marginTop: 0,
  },
  loginText: {
    fontFamily: fonts.Bold,
    color: colors.white,
    fontSize: 26,
    marginBottom: 10
  },
  shadedLayer: {
    backgroundColor: colors.splashShade,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  forgotText: {
    fontFamily: fonts.Regular,
    color: colors.white,
    fontSize: 16,
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 5
  },
  btnStyle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.white
  },
  edacText: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop:20,
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.Regular,
  }
});
