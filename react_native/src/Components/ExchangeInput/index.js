import React from 'react'
import {View, Text, TextInput, Image} from 'react-native'
import styles from './style'
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExchangeInput = (props) => {

    const txColor = props.darkmode ? 'white':'black';
    console.log(props.inputValue)
    return(
        <View style={styles.container}>
            <Text style={{...styles.label,color:txColor}}>{props.label}</Text>
            <View style={styles.row}>
                <TextInput onChangeText={(e) => {props.onChangeInput(e)}} value={props.inputValue} style={styles.inputField} />
                <View style={styles.iconContainer}>
                    <Image source={props.centerIcon} style={styles.centerIcon} />
                </View>
                <TextInput onChangeText={(e) => {props.onChangeUsdInput(e)}} value={props.usdInputValue} style={styles.inputField} />
                <View style={styles.iconContainer}>
                    <Ionicons name="logo-usd" style={{marginTop:7}} size={30} color="black" />
                </View>
            </View>
        </View>
    )
}

export default ExchangeInput