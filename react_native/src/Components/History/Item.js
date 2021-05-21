import React from 'react'
import {View, Text} from 'react-native'
import PropTypes from 'prop-types'
import styles from './style'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomStyles } from '../../Constant';
import Moment from 'react-moment';
class HistoryItem extends React.Component{
    constructor(props){
        super(props)
    }
    
    convert(date){
        let current_datetime = new Date(date)
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        return formatted_date;
      }
    render(){
        const {darkmode, item} = this.props;
        let date = this.convert(item.createdAt);
        return(
            <View>
                <View style={{marginBottom:15, flexDirection:'row'}}>
                    <View style={{alignItems:'center',alignSelf:'center', paddingRight:10}}>
                        <Ionicons name={item.transactionType==="send" ? "arrow-up-circle-outline" : "arrow-down-circle-outline"}  size={25} color={darkmode ? "white" :"black"} />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:15}]}>{item.transactionType==="send" ? "Sent" : "Received"}</Text>
                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{color:'white',fontSize:11}]}>{date}</Text>
                    </View>
                    <View style={{width:'35%'}}>
                        <Text style={{color:item.transactionType==="send" ? 'rgb(244,67,54)': 'rgb(70,155,74)',fontSize:15,textAlign:'right'}}>{parseFloat(item.value)} {item.tokenSymbol.toUpperCase()}</Text>
                        {/* <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:15,textAlign:'right'}]}>${item.value}</Text> */}
                    </View>
                </View> 
            </View>
        )
    }
}

HistoryItem.propTypes = {
    item : PropTypes.object,
    darkmode : PropTypes.bool
}
HistoryItem.defaultProps = {
    item : {},
    darkmode : true
}

export default HistoryItem