import React from 'react'
import {View, TouchableHighlight, Image, Text} from 'react-native'
import styles from './style'

const DropdownItem = ({onPress, item, index}) => {
    
    const _onPress = () => onPress(index)

    return (
        <View>
<<<<<<< HEAD
            <TouchableHighlight onPress={_onPress} activeOpacity={.6} underlayColor={"#000"}   style={{width:'100%', position:'relative'}}>
                <View style={{...styles.selectBox, borderBottomWidth:0}}>
=======
            <TouchableOpacity onPress={onPress} activeOpacity={1}>
                <View style={{...styles.selectBox, borderTopWidth:0}}>
>>>>>>> c3cbcdecec22d9bd2741ab29ece26a8277b6ca3b
                    <View style={{width:'20%'}}>
                        <Image source={item['image']} style={{...styles.activeIcon,marginRight:10}} />
                    </View>
                    <View style={styles.dropdownLabelContainer}>
                        <Text style={styles.activeTitle}>{item.f_text} {item.text}</Text>
                        <Text style={{fontSize:12}}>{item.value} {item.f_text} | ${item.u_v}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default DropdownItem