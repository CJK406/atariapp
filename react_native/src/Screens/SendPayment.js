import * as React from 'react';
import { InteractionManager, SafeAreaView, StyleSheet, Text,TextInput, Image, TouchableOpacity, View, Dimensions, } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles,Headers } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WAValidator from '../Assets/js/wallet-address-validator';
import { currency_convert as currency_convertApi} from '../Api';
import Logo from '../Assets/logo.png';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modal';

class SendPaymentScreen extends React.Component {
    state = {
        drop1_flag:false,
        drop2_flag:false,
        drop1_key:0,
        drop2_key:0,
        darkmode:true,
        address:"",
        currency:0,
        send_amount:0,
        send_usd_amount:0,
        qr_code_modal:false,
        r_address:"",
        balance:{},
        price:null,

	}
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.price != nextState.price 
    }
	componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.currencyCheck();
        })
	}
	componentWillUnmount() {
        
    }
    static getDerivedStateFromProps(props, state) {
        return {
            darkmode:props.darkmode,
            address: props.route.params.address,
            balance:props.balance,
            price:props.price
        };
      }
	navigate = (pagename) => {
		this.props.navigation.navigate(pagename);
    }
    
    currencyCheck = async () => {
        const {address} = this.state;
        let r_address;
        let currency=0;
        if(address[0]=="a" && address[1]=="t")
            currency = 1;
        else{
            r_address =this.getAddress(address)
            if(WAValidator.validate(r_address,'BTC'))
                currency=0;
            else if(WAValidator.validate(r_address,'LTC'))
                currency = 3;
            else if(WAValidator.validate(r_address,'ETH'))
                currency = 2;
            else 
                currency=4;
        }
        const current_usd_val = await currency_convertApi(Headers[currency]['text'].toLowerCase(),1);
        this.setState({
            usd_val:current_usd_val.result,
            currency:currency,
            r_address:r_address,
        })
    }
    onSuccess = async e => {
		let split = e.data.split(":");
		let address = split.length>1 ? split[1]:split[0];
		this.setState({
			r_address:address,
			qr_code_modal:false
		})
    };
    SendConfirm = () => {
		const {send_usd_amount, send_amount, r_address, currency} = this.state;
		if(r_address!=="" && send_amount!=="0.00"){
			
			let info= {send_usd_amount:send_usd_amount,send_amount:send_amount, address:r_address, currentTab:currency}
			this.props.navigation.navigate('SendConfirm',{ info: info });
		}
	}
    changeSendUsdValue =(e) =>{
        const {currency,price} =this.state;
		const currency_data = [['btc'],['atri'],['eth'],['ltc'],['bch']];
		let send_amount1 = e!=="" ?  (parseFloat(e)/parseFloat(price[currency_data[currency][0]])).toFixed(5) : "0.00";
		this.setState({
			send_amount:send_amount1,
			send_usd_amount:e
		})
		
	}
	changeSendValue = (e) =>{
        const {currency,price} =this.state;
		const currency_data = [['btc'],['atri'],['eth'],['ltc'],['bch']];
        
		let send_amount1 = e!=="" ?  (parseFloat(e)*parseFloat(price[currency_data[currency][0]])) : 0;
		this.setState({
			send_usd_amount:send_amount1.toFixed(2),
			send_amount:e
		})
	}
    getAddress=(address)=>{
        let split = address.split(":");
        let r_address="";
        if(split.length>1)
            r_address = split[1];
        else    
            r_address= split[0];
        return r_address;
    }
    setFullBallance = () =>{
		const {balance,currency} = this.state;
        const currency_data1 = [['btc',balance.btc,'#f7931a',balance.btc_usd],
                                ['atri',balance.atri,'#c42626',balance.atri_usd],
                                ['eth',balance.eth,'aqua',balance.eth_usd],
                                ['ltc',balance.ltc,'#345c9c',balance.ltc_usd],
                                ['bch',balance.bch,'green',balance.bch_usd]];
		let full_balance = currency_data1[currency][1];
		let send_amount1 = currency_data1[currency][3];

		this.setState({
			send_amount:full_balance.toFixed(5),
			send_usd_amount:send_amount1.toFixed(2)
		})
		// this.setTab({send_amount,full_balance,
		// 	send_usd_amount:send_amount1.toFixed(2)});
		
	}
  render() {
        const {darkmode,currency,balance} =this.state;
        const currency_data = [['btc',balance.btc,'#f7931a',balance.btc_usd],
                                ['atri',balance.atri,'#c42626',balance.atri_usd],
                                ['eth',balance.eth,'aqua',balance.eth_usd],
                                ['ltc',balance.ltc,'#345c9c',balance.ltc_usd],
                                ['bch',balance.bch,'green',balance.bch_usd]];

    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white',paddingTop:10}}>
            <View style={[CustomStyles.container, CustomStyles.innerContainer, styles.innerContainer]}>
                <View style={{height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <TouchableOpacity style={{position: 'absolute', left: 0}} onPress={() => this.navigate('Trade')}>
                        <Ionicons name="arrow-back-outline" size={20} color="white" />
                    </TouchableOpacity>
					<Image source={Logo} style={{width:160, height:50}} />
                </View>
                <View style={{ backgroundColor:darkmode?'rgb(33,33,33)':'white',borderRadius:10,width:'100%',margin:0,borderTopRightRadius:50,borderTopLeftRadius:50,marginTop:40}}>
                    <Image source={Headers[currency]['Image']} style={{width:25,height:25,marginTop:20,justifyContent:'center',alignItems:'center',alignSelf:'center'}}></Image>
                    <Text style={{fontSize:30, color:darkmode?'white':'black',textAlign:'center',marginTop:10,marginBottom:20}}>Send amount</Text>
                    <View style={{flexDirection:'row',textAlign:'center',alignSelf:'center',alignItems:'center'}}>
                        <View style={{width:'45%',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                            <TextInput 
                                onChangeText={(key) => this.changeSendValue(key)}
                                value={this.state.send_amount}
                                placeholder="0.00"  
                                placeholderTextColor="white" 
                                keyboardType={'numeric'} 
                                style={{color:darkmode?'white':'black',backgroundColor:'transparent',fontSize:24}}></TextInput>
                            <Text style={{color:darkmode?'white':'black',fontSize:24}}>{Headers[currency]['text']}</Text>
                        </View>
                        <View style={{width:'10%'}}>
                            <Ionicons name='swap-horizontal-outline'  size={24} color={darkmode?"white":'black'} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                        </View>
                        <View style={{width:'45%',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                            <TextInput 
                            onChangeText={(key) => this.changeSendUsdValue(key)}
                            value={this.state.send_usd_amount}
                            placeholder="0.00" 
                            placeholderTextColor="white" 
                            keyboardType={'numeric'} 
                            style={{color:darkmode?'white':'black',backgroundColor:'transparent',fontSize:26}}></TextInput>
                            <Text style={{color:darkmode?'white':'black',fontSize:24}}>USD</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
						<Text style={{color:darkmode?'white':'black',fontSize:20,marginTop:30}}>*Available: {currency_data[currency][1]} {Headers[currency]['text']}</Text>
						<TouchableOpacity 
							style={{marginTop:35,borderWidth:1,borderColor:'white',justifyContent:'center',alignItems:'center',alignSelf:'center',marginLeft:20,padding:5,borderRadius:10,backgroundColor:'rgb(227,30,45)',width:50,height:25,textAlign:'right'}} 
							onPress={this.setFullBallance} >
							<Text style={{color:'white'}}>Full</Text>	
						</TouchableOpacity>
					</View>
                    <View style={{flexDirection:'row',textAlign:'center',justifyContent:'center',marginBottom:30,marginTop:40}}>
                        <TextInput placeholder="Tap to paste address" onChangeText={(key) => this.setState({r_address:key})} placeholderTextColor={darkmode?"white":"black"} style={{backgroundColor:'transparent',color:darkmode?'white':'black',width:'90%',height:50,borderBottomWidth:1,borderBottomColor:darkmode?'white':'black'}} >
                            {this.state.r_address}
                        </TextInput>
                        <TouchableOpacity onPress={() =>this.setState({qr_code_modal:true})} style={{marginTop:20}} >
                            <Ionicons name='qr-code-outline'  size={20} color={darkmode?"white":'black'} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.SendConfirm} 
                        style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:200,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
                    >
                        <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <Modal isVisible={this.state.qr_code_modal}
						style={{margin:0,zIndex:99999}}
					>
						<View style={{ backgroundColor:'rgb(33,33,33)',borderRadius:10,width:'100%',height:'100%',margin:0}}>
						<QRCodeScanner
							onRead={this.onSuccess}
							topViewStyle={{flex: 0}}
							bottomViewStyle={{flex: 0}}
							cameraStyle={{height: Dimensions.get('window').height}}
							flashMode={RNCamera.Constants.FlashMode.off}
							/>
						</View>
					</Modal>
            </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
		justifyContent: 'flex-start',
		paddingTop: 0
	},
	customWriting: {
		fontSize: 12,
		color: '#7882A2'
	}
});

function mapStateToProps(state) {
  return {
        darkmode:state.Auth.darkmode,
        balance:state.Auth.balance,
        price:state.Auth.price,
  };
}
export default connect(mapStateToProps, {})(withTheme(SendPaymentScreen));
