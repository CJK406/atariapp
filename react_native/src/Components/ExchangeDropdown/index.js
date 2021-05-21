import React, { useEffect, useState } from 'react'
import {View, Text, Image,TouchableOpacity} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropdownItem from './items'
import styles from './style'

const ExchangeDropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeKey, setActiveKey] = useState(0)
    const {items, darkmode, label} = props

    useEffect(() => {
        if(props.defaultKey >= 0){
            setActiveKey(props.defaultKey)
        }
    },[])

    const txColor = darkmode?'white':'black'
    const carretIcon = () => {
        const icon = isOpen ? 'caret-up-outline' : 'caret-down-outline'
        return <Ionicons name={icon} style={styles.carretIcon} 
                    size={20} color="black" />
    }

    const onSelect = (selectedIdx) => {
        setIsOpen(false)
        setActiveKey(selectedIdx)

        if(typeof onSelect === 'function')
            props.onSelect(selectedIdx);
    }

    return(
        <View style={styles.container}>
            <Text style={{color:txColor, ...styles.label}}>{label}:</Text>
            <TouchableOpacity onPress={() => isOpen ? setIsOpen(false) : setIsOpen(true)} activeOpacity={.8}>
                <View style={styles.selectBox}>
                    <View style={{width:'20%'}}>
                        <Image source={items[activeKey]['image']} style={styles.activeIcon} />
                    </View>
                    <View style={styles.activeLabel}>
                        <Text style={styles.activeTitle}>{items[activeKey]['f_text']} {items[activeKey]['text']}</Text>
                        <Text style={{fontSize:12}}>{items[activeKey]['value']} {items[activeKey]['f_text']} | ${items[activeKey]['u_v']}</Text>
                    </View>
                    <View style={{textAlign:'right', width:'15%'}}>
                        {carretIcon()}
                    </View>
                </View>
            </TouchableOpacity>
            {isOpen &&
            <View style={styles.dropdownContainer}>
                {items.map((item, index) => <DropdownItem onPress={() => onSelect(index)} item={item}/>)}
            </View>
            }
        </View>
    )
}

export default ExchangeDropdown