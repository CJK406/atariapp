import React from 'react'
import {View, Text, TextInput, Image} from 'react-native'
import styles from './style'
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExchangeInput = (props) => {
    const txColor = props.darkmode ? 'white':'black';
    return(
        <View style={styles.container}>
            <Text style={{...styles.label,color:txColor}}>{props.label}</Text>
            <View style={styles.row}>
                {props.Type ? (
                    <TextInput 
                     onChangeText={(e) => {props.onChangeInput(e)}} 
                     value={props.inputValue} placeholder="Type amount"
                      placeholderTextColor={'rgba(0,0,0,0.6)'}
                       style={styles.inputField}
                       keyboardType={'numeric'} 

                        />

                ) :
                (
                    <Text style={styles.textField}>{props.inputValue}</Text>
                )
                }
                <View style={styles.iconContainer}>
                    <Image source={props.centerIcon} style={styles.centerIcon} />
                </View>
                <Text  style={styles.textField} >{props.usdInputValue}</Text>
                {/* <Text onChangeText={(e) => {props.onChangeUsdInput(e)}} value={props.usdInputValue} style={styles.textField} >{props.usdInputValue}</Text> */}
                <View style={styles.iconContainer}>
                    <Ionicons name="logo-usd" style={{marginTop:7}} size={30} color="black" />
                </View>
            </View>
        </View>
    )
}

export default ExchangeInput