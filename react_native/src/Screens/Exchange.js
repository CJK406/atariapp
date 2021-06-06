import * as React from 'react';
  import { SafeAreaView,FlatList, StyleSheet, Text, Image, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import { Header, ExchangeInput, ExchangeDropdown, AwesomeAlert } from '../Components';
import { Images } from '../Assets';
import Modal from 'react-native-modal';
import {exchange as exchangeApi} from '../Api';
import { updateBallance} from '../Redux/Actions';



class ExchangeScreen extends React.PureComponent {
    constructor(props) {
		super(props)
        this.awesomeAlert = null
	}
    state = {
        drop1_key:0,
        drop2_key:1,
        darkmode:true,
        show_modal:false,
		balance:{},
        drop1_open_flag:false,
        drop2_open_flag:false,
        price:{},
        buyInputValue:0,
        receiveInputValue:0,
        loading:false
	}
    
    static getDerivedStateFromProps(props, state) {
        return {
            darkmode:props.darkmode,
			balance:props.balance,
            price:props.price
        };
      }
      
	navigate = (pagename) => {
		this.props.navigation.navigate(pagename);
	}
    drop1_open = (flag) =>{
        if(flag){
            this.setState({drop1_open_flag:flag,drop2_open_flag:false});
        }
        else{
            this.setState({drop1_open_flag:flag});
        }
    }
    
    drop2_open = (flag) =>{
        if(flag){
            this.setState({drop2_open_flag:flag,drop1_open_flag:false});
        }
        else{
            this.setState({drop2_open_flag:flag});
        }
    }
    buyInputChange = (e) => {
        const {drop1_key,drop2_key,balance,price} = this.state;
        
        const exchage_from_data = [{image:Images.btc_icon,value:balance.btc.toFixed(8),u_v:(balance.btc_usd).toFixed(2), f_text:'BTC', text:'Bitcoin',price:price.btc,decimal:8},
            {image:Images.Atri_icon,value:balance.atri.toFixed(4),u_v:(balance.atri_usd).toFixed(2),f_text:'ATRI', text:'Atari token',price:price.atri,decimal:4},
            {image:Images.Eth_icon,value:balance.eth.toFixed(8),u_v:(balance.eth_usd).toFixed(2), f_text:'ETH', text:'Ethereum',price:price.eth,decimal:8},
            {image:Images.Ltc_icon,value:balance.ltc.toFixed(8),u_v:(balance.ltc_usd).toFixed(2), f_text:'LTC', text:'Litecoin',price:price.ltc,decimal:6},
            // {image:Images.bch_icon,value:balance.bch.toFixed(4),u_v:(balance.bch_usd).toFixed(2), f_text:'BCH', text:'Bitcoincash'}
            {image:Images.bch_icon,value:balance.usdt.toFixed(6),u_v:'0.00', f_text:'USDT', text:'USDT',price:price.usdt,decimal:8},
            {image:Images.bnb_icon,value:'0.00000000',u_v:'0.00', f_text:'BNB', text:'BNB',price:price.bnb,decimal:8},
        ]
        let receiveInputValue1 = (e*exchage_from_data[drop1_key]['price']/exchage_from_data[drop2_key]['price']).toFixed(exchage_from_data[drop2_key]['decimal'])
        this.setState({
            buyInputValue:e,
            receiveInputValue:receiveInputValue1
        })
    }

    receiveInputChange = (e) => {
        const {drop1_key,balance,price} = this.state;

        const exchage_from_data = [{image:Images.btc_icon,value:balance.btc.toFixed(8),u_v:(balance.btc_usd).toFixed(2), f_text:'BTC', text:'Bitcoin',price:price.btc,decimal:8},
            {image:Images.Atri_icon,value:balance.atri.toFixed(4),u_v:(balance.atri_usd).toFixed(2),f_text:'ATRI', text:'Atari token',price:price.atri,decimal:4},
            {image:Images.Eth_icon,value:balance.eth.toFixed(8),u_v:(balance.eth_usd).toFixed(2), f_text:'ETH', text:'Ethereum',price:price.eth,decimal:8},
            {image:Images.Ltc_icon,value:balance.ltc.toFixed(8),u_v:(balance.ltc_usd).toFixed(2), f_text:'LTC', text:'Litecoin',price:price.ltc,decimal:6},
            // {image:Images.bch_icon,value:balance.bch.toFixed(4),u_v:(balance.bch_usd).toFixed(2), f_text:'BCH', text:'Bitcoincash'}
            {image:Images.bch_icon,value:balance.usdt.toFixed(6),u_v:'0.00', f_text:'USDT', text:'USDT',price:price.usdt,decimal:8},
            {image:Images.bnb_icon,value:'0.00000000',u_v:'0.00', f_text:'BNB', text:'BNB',price:price.bnb,decimal:8},
        ]
        let buyInputValue1 = (e*price.atri/exchage_from_data[drop1_key]['price']).toFixed(exchage_from_data[drop1_key]['decimal'])
        this.setState({
            buyInputValue:buyInputValue1,
            receiveInputValue:e
        })
    }

    exchange = async() => {
        const {drop1_key,buyInputValue} = this.state;
        console.log("buyInputValue",buyInputValue)
        if(buyInputValue!=="" && buyInputValue!==0){
            this.setState({loading:true});
            const token = ["btc","atari","ether","ltc","usdt","bnb"];
            const data = await exchangeApi(token[drop1_key],buyInputValue);
            this.setState({loading:false});
            if(data.code===200){
                //alert("Success exchanged");
                this.awesomeAlert.showAlert('success', "Congratulations", "Your balance success excanged!");
                this.props.updateBallance();
            }
            else
                this.awesomeAlert.showAlert('error', "Failed!", data.message);
                //alert(data.message);
        }
        else
            //alert("Amount is empty. Please check again.");
            this.awesomeAlert.showAlert('warning', "Amount is empty", "Please fill amount");
    }
    render() {

        const {drop1_key,drop2_key,darkmode,balance,price,buyInputValue,receiveInputValue} = this.state;
        const exchage_from_data = [{image:Images.btc_icon,value:balance.btc.toFixed(8),u_v:(balance.btc_usd).toFixed(2), f_text:'BTC', text:'Bitcoin',price:price.btc},
            {image:Images.Atri_icon,value:balance.atri.toFixed(4),u_v:(balance.atri_usd).toFixed(2),f_text:'ATRI', text:'Atari token',price:price.atri},
            {image:Images.Eth_icon,value:balance.eth.toFixed(8),u_v:(balance.eth_usd).toFixed(2), f_text:'ETH', text:'Ethereum',price:price.eth},
            {image:Images.Ltc_icon,value:balance.ltc.toFixed(8),u_v:(balance.ltc_usd).toFixed(2), f_text:'LTC', text:'Litecoin',price:price.ltc},
            // {image:Images.bch_icon,value:balance.bch.toFixed(4),u_v:(balance.bch_usd).toFixed(2), f_text:'BCH', text:'Bitcoincash'}
            {image:Images.bch_icon,value:balance.usdt.toFixed(6),u_v:'0.00', f_text:'USDT', text:'USDT',price:price.usdt},
            {image:Images.bnb_icon,value:'0.00000000',u_v:'0.00', f_text:'BNB', text:'BNB',price:price.bnb},
        ]
        
    const themeBg = darkmode?'rgb(33,33,33)':'white';
   
    const renderItem = ({ item }) => (
        <View style={[CustomStyles.container, styles.innerContainer]}>
            <Header darkmode={darkmode}/>
            
            <View style={{padding:20}}>
                <ExchangeDropdown items={exchage_from_data} darkmode={darkmode}
                    label={'From'}
                    onSelect={index => this.setState({drop1_key:index})}
                    isOpen={this.state.drop1_open_flag}
                    drop_open={(e) => {this.drop1_open(e)}}
                />
                <ExchangeDropdown items={exchage_from_data} darkmode={darkmode}
                    label={'To'}
                    defaultKey={drop2_key}
                    onSelect={index => this.setState({drop2_key:index})}
                    isOpen={this.state.drop2_open_flag}
                    drop_open={(e) => {this.drop2_open(e)}}

                />
                
                <ExchangeInput label={'Buy now'} 
                    onChangeInput={(e) => {this.buyInputChange(e)}} 
                    usd_price={exchage_from_data[drop1_key]['price']} 
                    centerIcon={exchage_from_data[drop1_key]['image']} 
                    darkmode={darkmode} 
                    inputValue = {buyInputValue.toString()}
                    />
                <ExchangeInput label={'Receive'} 
                    onChangeInput={(e) => {this.receiveInputChange(e)}} 
                    usd_price={exchage_from_data[drop2_key]['price']} 
                    centerIcon={exchage_from_data[drop2_key]['image']} 
                    darkmode={darkmode} 
                    inputValue = {receiveInputValue.toString()}
                    />

                <TouchableOpacity  
                    style={{backgroundColor:'rgb(227,30,45)',marginTop:20, padding:15,borderRadius:10,textAlign:'center',justifyContent:'center'}}
                    onPress={this.exchange}
            >
                    {this.state.loading
                        ?<ActivityIndicator size="large" color="white" />
                        :<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Buy Now</Text>
                      }
                </TouchableOpacity>
            </View>
        
        </View>
      );
    return (
        
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: themeBg }}>
            <FlatList
                data={[1]}
                renderItem={renderItem}
            />
            <AwesomeAlert ref={(ref) => this.awesomeAlert = ref }/> 
            <Modal
					isVisible={this.state.show_modal}
					>
					<View style={{ backgroundColor:'white',borderRadius:10}}>
						<Image source={Images.exchange_gif} style={{justifyContent:'center', width:'100%',height:200,marginTop:40}} />
						<Text style={{fontSize:30, textAlign:'center',marginTop:40,marginBottom:20}}>Available Soon</Text>
						<Text style={{textAlign:'center',padding:20,fontSize:20}}>Exchange feature will be available soon.</Text>
						<TouchableOpacity onPress={this.modalToggle} 
							style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:20,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
						>
							<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>OK</Text>
						</TouchableOpacity>
					</View>
				</Modal>
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
		balance: state.Auth.balance,
        price:state.Auth.price

  };
}

export default connect(mapStateToProps, {updateBallance})(withTheme(ExchangeScreen));
