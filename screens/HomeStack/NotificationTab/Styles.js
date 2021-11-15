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
    padding:15,
    borderBottomWidth:.8,
    borderBottomColor:colors.grey
  },
  container: {
    width:'100%',
    height:height-250,
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContainer: {
    marginHorizontal:5
  },
  itemLeftContainer:{
    flexDirection:'row',
    width:'70%',
    alignItems:'center',
  },
  itemRightContainer:{
    alignItems:'flex-end',
    justifyContent:'center',
    width:'30%',
    // backgroundColor:'red'
  },
  imageContainer:{
    backgroundColor:colors.lightGrey,
    alignItems:'center',
    justifyContent:'center',
    width:45,
    height:45,
    borderRadius:30,
    marginRight:13
  },
  leftImage:{
    width:25,
    height:25,
    resizeMode:'stretch'
  },
  calendarContainer:{
    flexDirection:'row',
    // alignItems:'center',
    marginTop:5
  },
  titleStyle:{
    fontSize:12,
    fontFamily:fonts.Regular,
    color:colors.grey
  },
  descriptionStyle:{
    fontSize:14,
    color:colors.black,
    fontFamily:fonts.Bold,
    marginTop:3
  },
  calendarImage:{
    width:18,
    height:18,
    resizeMode:'stretch'
  },
  dateStyle:{
    fontFamily:fonts.Regular,
    fontSize:12,
    color:colors.grey,
    marginLeft:7
  },
  remainingDaysStyle:{
    fontFamily:fonts.Regular,
    fontSize:12,
    color:colors.grey,
    marginLeft:10,
    marginTop:8
  },
  notificationReadContainer:{
    // backgroundColor:'green'
    flexDirection:'row'
  },
  readBtn:{
    width:21,
    height:21,
    borderWidth:1,
    borderColor:colors.grey,
    backgroundColor:'white',
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
  },
  crossBorder:{
    width:21,
    height:21,
    borderWidth:1,
    borderColor:colors.grey,
    backgroundColor:'white',
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    marginLeft:8
  },
  redDot:{
    width:15,
    height:15,
    borderRadius:12,
    backgroundColor:'red'
  },
  crossIcon:{
    width:8,
    height:8,
    resizeMode:'contain',
    tintColor:colors.grey
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
