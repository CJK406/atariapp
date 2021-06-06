import * as React from 'react';
  import { SafeAreaView,FlatList, StyleSheet, Text, Image, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import { Header, ExchangeInput, ExchangeDropdown } from '../Components';
import { Images } from '../Assets';
import Modal from 'react-native-modal';
import {exchange as exchangeApi} from '../Api';
import { updateBallance} from '../Redux/Actions';


class ExchangeScreen extends React.Component {
    constructor(props) {
		super(props)
	
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
        usdInputValue:0,
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
      
    }
    buyInputChange = (e,exchage_from_data) => {
        const {drop1_key,drop2_key,balance,price} = this.state;
        let receiveInputValue1 = (e*exchage_from_data[drop1_key]['price']/exchage_from_data[drop2_key]['price']).toFixed(exchage_from_data[drop2_key]['decimal'])
        let usd_price = (e*exchage_from_data[drop1_key]['price']).toFixed(2);
        this.setState({
            buyInputValue:e,
            receiveInputValue:receiveInputValue1,
            usdInputValue:usd_price,
        })
    }

    receiveInputChange = (e,exchage_from_data) => {
        const {drop1_key,balance,price} = this.state;
        let buyInputValue1 = (e*price.atri/exchage_from_data[drop1_key]['price']).toFixed(exchage_from_data[drop1_key]['decimal'])
        let usd_price = (e*price.atri).toFixed(2);
        this.setState({
            buyInputValue:buyInputValue1,
            receiveInputValue:e,
            usdInputValue:usd_price,

        })
    }

 
    usdInputChange = (e,exchage_from_data) => {
        const {drop1_key,balance,price,drop2_key} = this.state;
        let buyInputValue1 = (e/exchage_from_data[drop1_key]['price']).toFixed(exchage_from_data[drop1_key]['decimal'])
        let receiveInputValue1     = (e/price.atri).toFixed(4)
        console.log(buyInputValue1,receiveInputValue1)
        this.setState({
            buyInputValue:buyInputValue1,
            receiveInputValue:receiveInputValue1,
            usdInputValue:e
        })
    }
    
    
    exchange = async() => {
        const {drop1_key,buyInputValue} = this.state;
        if(buyInputValue!=="" && buyInputValue!==0){
            this.setState({loading:true});
            const token = ["btc","atari","ether","ltc","usdt","bnb"];
            const data = await exchangeApi(token[drop1_key],buyInputValue);
            this.setState({loading:false});
            if(data.code===200){
                alert("Success exchanged");
                this.props.updateBallance();
            }
            else
                alert(data.message);
        }
        else
            alert("Amount is empty. Please check again.");
    }
    render() {

        const {drop1_key,drop2_key,darkmode,balance,price,buyInputValue,receiveInputValue,usdInputValue} = this.state;
        const exchage_from_data = [{image:Images.btc_icon,value:balance.btc.toFixed(8),u_v:(balance.btc_usd).toFixed(2), f_text:'BTC', text:'Bitcoin',price:price.btc,decimal:8},
            {image:Images.Atri_icon,value:balance.atri.toFixed(4),u_v:(balance.atri_usd).toFixed(2),f_text:'ATRI', text:'Atari token',price:price.atri,decimal:4},
            {image:Images.Eth_icon,value:balance.eth.toFixed(8),u_v:(balance.eth_usd).toFixed(2), f_text:'ETH', text:'Ethereum',price:price.eth,decimal:8},
            {image:Images.Ltc_icon,value:balance.ltc.toFixed(8),u_v:(balance.ltc_usd).toFixed(2), f_text:'LTC', text:'Litecoin',price:price.ltc,decimal:6},
            // {image:Images.bch_icon,value:balance.bch.toFixed(4),u_v:(balance.bch_usd).toFixed(2), f_text:'BCH', text:'Bitcoincash'}
            {image:Images.bch_icon,value:balance.usdt.toFixed(6),u_v:'0.00', f_text:'USDT', text:'USDT',price:price.usdt,decimal:8},
            {image:Images.bnb_icon,value:'0.00000000',u_v:'0.00', f_text:'BNB', text:'BNB',price:price.bnb,decimal:8},
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
                    onChangeInput={(e) => {this.buyInputChange(e,exchage_from_data)}} 
                    onChangeUsdInput={(e) => {this.usdInputChange(e,exchage_from_data)}} 

                    usd_price={exchage_from_data[drop1_key]['price']} 
                    centerIcon={exchage_from_data[drop1_key]['image']} 
                    darkmode={darkmode} 
                    inputValue = {buyInputValue}
                    usdInputValue={usdInputValue}
                    />
                <ExchangeInput label={'Receive'} 
                    onChangeInput={(e) => {this.receiveInputChange(e,exchage_from_data)}} 
                    onChangeUsdInput={(e) => {this.usdInputChange(e,exchage_from_data)}} 
                    usd_price={exchage_from_data[drop2_key]['price']} 
                    centerIcon={exchage_from_data[drop2_key]['image']} 
                    darkmode={darkmode} 
                    inputValue = {receiveInputValue}
                    usdInputValue={usdInputValue}

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
            <Modal
					isVisible={this.state.show_modal}
					>
					<View style={{ backgroundColor:'white',borderRadius:10}}>
						<Image source={Images.exchange_gif} style={{justifyContent:'center', width:'100%',height:200,marginTop:40}} />
						<Text style={{fontSize:30, textAlign:'center',marginTop:40,marginBottom:20}}>Available Soon</Text>
						<Text style={{textAlign:'center',padding:20,fontSize:20}}>Exchange feature will be available soon.</Text>
						<TouchableOpacity onPress={() => this.setState({show_modal:false})} 
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
