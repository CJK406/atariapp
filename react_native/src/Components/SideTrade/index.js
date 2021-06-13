import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './style'
const SideTrade = ({label, icon, onPress, position}) => {
    const radiusStyle = position === 'left' ? styles.rightRadius : styles.leftRadius
    return(
        <View style={{width:70}}>
            <TouchableHighlight onPress={onPress} style={{...styles.container,...radiusStyle}}>
                <View>
                    <Ionicons name={icon}  size={20} color="white" />
                    <Text style={styles.labelStyle}>{label}</Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}
export default SideTrade