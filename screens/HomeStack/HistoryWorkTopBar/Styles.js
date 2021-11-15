import { StyleSheet ,Dimensions} from 'react-native';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors'
const {width,height}=Dimensions.get('window')
export const styles = StyleSheet.create({
  safeStyle:{ 
    flex: 1,
  },
  itemContainer:{
    flexDirection:'row',
    width:'100%',
    padding:17,
    paddingTop:27,
    paddingBottom:27,
    borderBottomWidth:.7,
    borderBottomColor:colors.grey,
    justifyContent:'space-between'
  },
  flatListContainer: {
    // marginHorizontal:5
  },
  itemHeadingStyle:{
    fontSize:14,
    color:colors.green,
    fontFamily:fonts.Regular,
    textDecorationLine:'underline'
  },
  dateStyle:{
    fontSize:14,
    color:colors.black,
    fontFamily:fonts.Regular,
  },
  emptyContainer:{
    width:width,
    height:height-180,
    // backgroundColor:'red',
    alignItems:'center',
    justifyContent:'center'
  },
  emptyText:{
    fontFamily:fonts.Regular,
    fontSize:14,
    color:colors.black,
    marginLeft:7
  },
});
