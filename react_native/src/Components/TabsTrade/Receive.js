import React from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import Clipboard from '@react-native-community/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import QRCode from 'react-native-qrcode-svg'

const Receive = (props) => {
    const {darkmode, address, icon, crypto_name, color} = props

    const themeBG = darkmode ? 'rgb(33,33,33)':'white'
    const txtColor = darkmode?'white':'black'

    return(
        <View style={{ backgroundColor:themeBG,borderRadius:10,top:'30%',width:'98%',marginLeft:'1%',borderTopRightRadius:50,borderTopLeftRadius:50}}>
            <Text style={{fontSize:30, color:txtColor,textAlign:'center',marginTop:20,marginBottom:20}}>Address</Text>
            
            <View style={{textAlign:'center',
            justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:5,paddingBottom:0,marginBottom:0,borderColor:color,borderWidth:10,borderRadius:10}}>
                {address !=="" && (
                    <QRCode
                    value={address}
                    logo={icon}
                    logoSize={40}
                    size={170}
                    backgroundColor={"white"}
                    quietZone={10}
                    logoMargin={4}
                    logoBackgroundColor={"white"}
                    logoBorderRadius={3}
                />
                )}
                
            </View>
            <View style={{textAlign:'center',justifyContent:'center',marginBottom:150}}>
                <Text style={{backgroundColor:'transparent',height:50,color:color, fontSize:15,fontWeight:'700',textAlign:'center', marginTop:20}}>{address}</Text>
                {/* <TextInput editable = {false} style={{backgroundColor:'transparent',width:'90%',height:50,color:txtColor}}>{address}</TextInput> */}
                <TouchableOpacity  onPress={()=> {Clipboard.setString(address)}}>
                    <Ionicons name='documents-outline'  size={30} color={txtColor} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Receive