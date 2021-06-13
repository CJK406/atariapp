import React from 'react'
import {TouchableOpacity, View, Switch, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style'
const SettingMenu = (props) => {
    const onPress = props.onPress ? {onPress:props.onPress} : {}
    const color = props.themeToggle ? 'rgb(66,66,66)' : '#ce2424';
    return(
        <TouchableOpacity style={{backgroundColor:color, ...styles.container}} {...onPress} activeOpacity={.8}>
            <View style={styles.childBox}>
                <View style={{width:'10%'}}>
                    <Ionicons name={props.icon} size={26} color="white" />
                </View>
                <View style={{width:'75%'}}>
                    <Text style={styles.title}>{props.title}</Text>
                    {props.subTitle && 
                        <Text style={styles.subTitle}>{props.subTitle}</Text>
                    }
                </View>
                <View style={{width:'15%'}}>
                {props.withAction && 
                    <Switch
                        trackColor={{ false: "white", true: "red" }}
                        thumbColor="white"
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={props.onAction}
                        value={props.actionValue}
                    />
                }
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default SettingMenu