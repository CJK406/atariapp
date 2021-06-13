import React from 'react'
import {View, Text, Image} from 'react-native'
import { CustomStyles } from '../../Constant';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';

const BalanceList = (props) => {
    
    return (
        <View style={{flexDirection:'row', alignItems:'center',marginBottom:10, marginLeft:10, width:'50%'}}>
            {props.isIcon
                ? <FontawesomeIcon name={props.icon} style={{marginTop:13,marginRight:15}} size={20} color={props.iconColor} /> 
                : <Image source={props.icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
            }
            <View style={{flexDirection:'row'}}>
                <Text style={[props.darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5}]}>{props.balance}</Text>
                <Text style={{marginTop:10,color:props.iconColor}}>{props.label}</Text> 
            </View>
        </View>
    )
}

export default BalanceList