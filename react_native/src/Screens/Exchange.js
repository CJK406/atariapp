import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import { Header, ExchangeInput, ExchangeDropdown } from '../Components';
import { Images } from '../Assets';
import Modal from 'react-native-modal';


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
       
	}
    static getDerivedStateFromProps(props, state) {
        return {
            darkmode:props.darkmode,
			balance:props.balance,
        };
      }
	navigate = (pagename) => {
		this.props.navigation.navigate(pagename);
	}

    render() {

        const {drop1_key,drop2_key,darkmode,balance} = this.state;
        const exchage_from_data = [{image:Images.btc_icon,value:balance.btc.toFixed(5),u_v:(balance.btc_usd).toFixed(2), f_text:'BTC', text:'Bitcoin'},
                                    {image:Images.Atri_icon,value:balance.atri.toFixed(2),u_v:(balance.atri_usd).toFixed(2),f_text:'ATRI', text:'Atari token'},
                                    {image:Images.Eth_icon,value:balance.eth.toFixed(4),u_v:(balance.eth_usd).toFixed(2), f_text:'ETH', text:'Ethereum'},
                                    {image:Images.Ltc_icon,value:balance.ltc.toFixed(4),u_v:(balance.ltc_usd).toFixed(2), f_text:'LTC', text:'Litecoin'},
                                    // {image:Images.bch_icon,value:balance.bch.toFixed(4),u_v:(balance.bch_usd).toFixed(2), f_text:'BCH', text:'Bitcoincash'}
                                    {image:Images.bch_icon,value:0.00,u_v:0.00, f_text:'USDT', text:'USDT'},

                                ]

    const themeBg = darkmode?'rgb(33,33,33)':'white'
    
    return (
        
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: themeBg }}>
            <ScrollView  style={{flex:1, paddingBottom:20}}>
            <View style={[CustomStyles.container, styles.innerContainer]}>
                <Header darkmode={darkmode}/>
                
                <View style={{padding:20}}>
                    <ExchangeDropdown items={exchage_from_data} darkmode={darkmode}
                        label={'From'}
                        onSelect={index => this.setState({drop1_key:index})}
                    />
                    <ExchangeDropdown items={exchage_from_data} darkmode={darkmode}
                        label={'To'}
                        defaultKey={drop2_key}
                        onSelect={index => this.setState({drop2_key:index})}
                    />
                    
                    <ExchangeInput label={'Buy now'} centerIcon={exchage_from_data[drop1_key]['image']} darkmode={darkmode} />
                    <ExchangeInput label={'Receive'} centerIcon={exchage_from_data[drop2_key]['image']} darkmode={darkmode} />

                    <TouchableOpacity  
                        style={{backgroundColor:'rgb(227,30,45)',marginTop:20, padding:15,borderRadius:10,textAlign:'center',justifyContent:'center'}}
                        onPress={() =>{this.setState({show_modal:true})}}
                   >
                        <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
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
            </View>
            </ScrollView>
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

  };
}

export default connect(mapStateToProps, {})(withTheme(ExchangeScreen));
