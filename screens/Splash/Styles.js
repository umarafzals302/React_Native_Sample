import { StyleSheet } from 'react-native';
import colors from './../../utils/colors'
import fonts from './../../assets/fonts/'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadedLayer: {
    backgroundColor: colors.splashShade,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  logoImage: {
    width: '70%',
    height: 50,
    resizeMode: 'contain',
  },
  appName:{
    color:colors.lightGreen,
    fontSize:16,
    fontFamily:fonts.Bold,
    marginTop:15,
    marginHorizontal:15,
    textAlign:'center'
  }
});
