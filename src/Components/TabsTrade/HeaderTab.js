import React from 'react'
import {View, Text, Image, TouchableHighlight} from 'react-native'
import { Headers } from '../../Constant';
import styles from './style'

function commafy( num ) {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
const HeaderTab = (props) => {
    
    const {darkmode, balance, activeTab, onPressTab} = props;
    const a = 3000;
    const themeBG   = props.darkmode ? 'black':'white'
    const txtColor  = props.darkmode ? 'white':'black'
    return(
        <View>
            <View style={{backgroundColor:themeBG,paddingBottom:10}}>
                <Text style={{color:txtColor, ...styles.alignCenter}}>Total Balance</Text>
                <Text style={{color:txtColor, ...styles.alignCenter}}>${commafy(balance.sum.toFixed(2))}</Text>

            </View>
            <View style={[{ backgroundColor: themeBG}, styles.topTabBar]}>
                {Headers.map((item, index) => 
                    <TouchableHighlight onPress={() => onPressTab(index, item)} 
                        style={[styles.topTab, activeTab === index && styles.activeTab]} key={index}>
                        <Image source={item.Image} style={styles.tabHeaderIcon}></Image>							
                    </TouchableHighlight>)}
            </View>
        </View>
    )
}
export default HeaderTab