import React, { useEffect, useState } from 'react'
import {View, Text, Image, TextInput, TouchableOpacity, Dimensions, BackHandler} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-community/clipboard'
import {CryptoStyle, Headers} from '../../Constant'
import styles from './style'
import Modal from 'react-native-modal'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import {AwesomeAlert} from '../../Components'

const Send = (props) => {
    const navigation = useNavigation();
    const [amount,setAmount] = useState("0")
    const [amountUsd, setAmountUsd] = useState('0.00')
    const [destination, setDestination] = useState('')
    const [showQR, setShowQR] = useState(false)
    const {darkmode, tabData, cryptoBalance, usdBalance, price} = props
    const currency = tabData.text
    const curr_key = currency.toLowerCase()
    const themeBG = darkmode?'rgb(33,33,33)':'white'
    const txtColor = darkmode?'white':'black'

  
    const onChangeValue = (e) => {
        if (currency!=="ATRI" || e[e.length-1]!=="." && e[e.length-1]!==","){
            const usd = e!=="" ?  (parseFloat(e)*parseFloat(price)) : 0;
            setAmount(e)
            setAmountUsd(usd.toFixed(2))
        }
        
    }
    const onChangeUsdValue = (e) => {
		const coin = e!=="" ?  (parseFloat(e)/parseFloat(price)).toFixed(CryptoStyle[curr_key]['decimal']) : 0;
        setAmount(coin)
        setAmountUsd(e)
    }
    const setFullBalance = () => {
        const {decimal} = CryptoStyle[curr_key]
        setAmount((parseFloat(cryptoBalance)*0.95).toFixed(decimal))
        setAmountUsd(parseFloat(usdBalance).toFixed(2))
    }
    const focusSendInput = async() => {
		const text = await Clipboard.getString();
		setDestination(text)
	};
    const sendConfirm = () => {
		let status=true;
        let message = "";
        if(destination==="")
        {
            message="The address is empty. Please check again";
            status=false;
        }
        if(amount==="0" || amount===""){
            status=false;
            message="The amount could not zero";
        }
        if(parseFloat(amount)>parseFloat(cryptoBalance))
        {
            message="The send amount should be less than balance";
            status=false;
        }

        if(status){
            props.closeModal();
            const currTab = Headers.findIndex((item) => item.text === currency)
			let info= {send_usd_amount:amountUsd,send_amount:amount, address:destination, currentTab:currTab}
			navigation.navigate('SendConfirm',{ info: info });
		}
        else if(!status){
			this.awesomeAlert.showAlert('error', "Failed!", message);
        }

        
    }
    onScanned = async e => {
		let split = e.data.split(":");
		let address = split.length>1 ? split[1]:split[0];
		setDestination(address)
        setShowQR(false)
	}
    const backAction = () => {
        if(showQR){
            setShowQR(false)
            return true;
        }
    };
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, []);
    return(
        <View style={{...styles.modalContainer,backgroundColor:themeBG}}>
       		<AwesomeAlert ref={(ref) => this.awesomeAlert = ref }/> 
            <Image source={tabData.Image} style={styles.icSend}></Image>
            <Text style={{ color:txtColor, ...styles.modalTitle}}>Send amount</Text>
            <View style={{flexDirection:'row',textAlign:'center',alignSelf:'center',alignItems:'center'}}>
                <View style={{width:'45%',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                    <TextInput 
                        onChangeText={(key) => onChangeValue(key)}
                        value={amount.toString()}
                        placeholder="0"  
                        placeholderTextColor="white" 
                        keyboardType={'numeric'} 
                        style={{color:txtColor,backgroundColor:'transparent',fontSize:24}}></TextInput>
                    <Text style={{color:txtColor,fontSize:24}}>{currency}</Text>
                </View>
                <View style={{width:'10%'}}>
                    <Ionicons name='swap-horizontal-outline'  size={24} color={txtColor} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                </View>
                <View style={{width:'45%',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                    <TextInput 
                        onChangeText={(key) => onChangeUsdValue(key)}
                        value={amountUsd.toString()}
                        placeholder="0.00" 
                        placeholderTextColor="white" 
                        keyboardType={'numeric'} 
                        style={{color:txtColor,backgroundColor:'transparent',fontSize:26}}></TextInput>
                    <Text style={{color:txtColor,fontSize:24}}>USD</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                <Text style={{color:darkmode?'white':'black',fontSize:20,marginTop:20}}>*Available: {cryptoBalance} {currency}</Text>
                <TouchableOpacity 
                    style={{marginTop:15,borderWidth:1,borderColor:'white',justifyContent:'center',alignItems:'center',alignSelf:'center',marginLeft:20,padding:5,paddingTop:0,borderRadius:10,backgroundColor:'rgb(227,30,45)',width:50,height:25,textAlign:'right'}} 
                    onPress={setFullBalance} >
                    <Text style={{color:'white'}}>Full</Text>	
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',textAlign:'center',justifyContent:'center',marginBottom:30,marginTop:40}}>
                <TextInput placeholder="Tap to paste address" 
                    onChangeText={(key) => setDestination(key)} 
                    onFocus={focusSendInput}
                    placeholderTextColor={txtColor} 
                    style={{backgroundColor:'transparent',color:txtColor,width:'90%',height:50,borderBottomWidth:1,borderBottomColor:txtColor}} >
                    {destination}
                </TextInput>
                <TouchableOpacity onPress={() => setShowQR(true)} style={{marginTop:20}} >
                    <Ionicons name='qr-code-outline'  size={20} color={txtColor} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={sendConfirm} 
                style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:200,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
            >
                <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Continue</Text>
            </TouchableOpacity>

            <Modal isVisible={showQR}
				style={{margin:0,zIndex:99999}}
				 onBackButtonPress={backAction}
			>
				<View style={{ backgroundColor:'rgb(33,33,33)',borderRadius:10,width:'100%',height:'100%',margin:0}}>
				<QRCodeScanner
					onRead={onScanned}
					topViewStyle={{flex: 0}}
					bottomViewStyle={{flex: 0}}
					cameraStyle={{height: Dimensions.get('window').height}}
					flashMode={RNCamera.Constants.FlashMode.off}
					/>
				</View>
			</Modal>
        </View>
    )
}

export default Send