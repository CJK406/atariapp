import React from 'react'
import {View, TouchableOpacity, Image, Text} from 'react-native'
import styles from './style'

const DropdownItem = ({onPress, item}) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} activeOpacity={1}>
                <View style={{...styles.selectBox, borderTopWidth:0}}>
                    <View style={{width:'20%'}}>
                        <Image source={item['image']} style={{...styles.activeIcon,marginRight:10}} />
                    </View>
                    <View style={styles.dropdownLabelContainer}>
                        <Text style={styles.activeTitle}>{item.f_text} {item.text}</Text>
                        <Text style={{fontSize:12}}>{item.value} {item.f_text} | ${item.u_v}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
export default DropdownItem