import * as React from 'react';
import { SafeAreaView, StyleSheet, Text,TextInput, Image, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogoBox } from '../Components';
import { Images } from '../Assets';
import Modal from 'react-native-modal';

class ExchangeScreen extends React.Component {
    state = {
        drop1_flag:false,
        drop2_flag:false,
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

        const {drop1_flag,drop2_flag,drop1_key,drop2_key,darkmode,balance} = this.state;
        const exchage_from_data = [{image:Images.btc_icon,value:balance.btc.toFixed(5),u_v:(balance.btc_usd).toFixed(2), f_text:'BTC', text:'Bitcoin'},
                                    {image:Images.Atri_icon,value:balance.atri.toFixed(2),u_v:(balance.atri_usd).toFixed(2),f_text:'ATRI', text:'Atari token'},
                                    {image:Images.Eth_icon,value:balance.eth.toFixed(4),u_v:(balance.eth_usd).toFixed(2), f_text:'ETH', text:'Ethereum'},
                                    {image:Images.Ltc_icon,value:balance.ltc.toFixed(4),u_v:(balance.ltc_usd).toFixed(2), f_text:'LTC', text:'Litecoin'},
                                    // {image:Images.bch_icon,value:balance.bch.toFixed(4),u_v:(balance.bch_usd).toFixed(2), f_text:'BCH', text:'Bitcoincash'}
                                    {image:Images.bch_icon,value:0.00,u_v:0.00, f_text:'USDT', text:'USDT'},

                                ]
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white' }}>
            <View style={[CustomStyles.container, styles.innerContainer]}>
                <View style={{height: 70, alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor:darkmode?'black':'white', width:'100%'}}>
                    <LogoBox style={{position: 'absolute', left: 0}}/>
                    <Image source={Images.Logo} style={{width:160, height:50}} />
                </View>
                <View style={{padding:20}}>
                    <View style={{position:'relative'}}>
                        <Text style={{fontSize:14, letterSpacing:2, color:darkmode?'white':'black', marginBottom:20}}>From:</Text>
                        <TouchableOpacity onPress={() => this.setState({drop1_flag:!drop1_flag})}>
                            <View style={{width:'100%',paddingLeft:20,paddingTop:6,paddingBottom:6,paddingRight:20,borderWidth:1,borderColor:'black',backgroundColor:'white', flexDirection:'row'}}>
                                <View style={{width:'20%'}}>
                                    <Image source={exchage_from_data[drop1_key]['image']} style={{width:20, height:20, marginTop:13,marginRight:20}} />
                                </View>
                                <View style={{width:'65%', alignSelf:'center'}}>
                                    <Text style={{fontSize:15,fontWeight:'600'}}>{exchage_from_data[drop1_key]['f_text']} {exchage_from_data[drop1_key]['text']}</Text>
                                    <Text style={{fontSize:12}}>{exchage_from_data[drop1_key]['value']} {exchage_from_data[drop1_key]['f_text']} | ${exchage_from_data[drop1_key]['u_v']}</Text>
                                </View>
                                <View style={{textAlign:'right', width:'15%'}}>
                                    {drop1_flag ? (
                                        <Ionicons name="caret-up-outline" style={{marginTop:13,marginRight:15,textAlign:'right'}} size={20} color="black" />
                                    ) : (
                                        <Ionicons name="caret-down-outline" style={{marginTop:13,marginRight:15,textAlign:'right'}} size={20} color="black" />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                        {drop1_flag &&
                        <View style={{position:'absolute', width:'100%',top:90, zIndex:999999}}>
                            {exchage_from_data.map((item, index) => 
                                // {drop1_flag &&
                                    <View>
                                        <TouchableOpacity onPress={() => this.setState({drop1_flag:false,drop1_key:index})}>
                                            <View style={{width:'100%',paddingLeft:20,paddingRight:20,paddingTop:6,paddingBottom:6,borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'black',backgroundColor:'white', flexDirection:'row'}}>
                                                <View style={{width:'20%'}}>
                                                    <Image source={item['image']} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                                </View>
                                                <View style={{width:'80%', alignSelf:'center'}}>
                                                    <Text style={{fontSize:15,fontWeight:'600'}}>{item.f_text} {item.text}</Text>
                                                    <Text style={{fontSize:12}}>{item.value} {item.f_text} | ${item.u_v}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                // }
                            )}
                        </View>
                        }
                    </View>
                    
                    <View style={{position:'relative'}}>
                        <Text style={{fontSize:14, letterSpacing:2, color:darkmode?'white':'black', marginBottom:20,marginTop:20}}>To:</Text>
                        <TouchableOpacity onPress={() => this.setState({drop2_flag:!drop2_flag})}>
                            <View style={{width:'100%',paddingLeft:20,paddingRight:20,paddingTop:6,paddingBottom:6,borderWidth:1,borderColor:'black',backgroundColor:'white', flexDirection:'row'}}>
                                <View style={{width:'20%'}}>
                                    <Image source={exchage_from_data[drop2_key]['image']} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                </View>
                                <View style={{width:'65%', alignSelf:'center'}}>
                                    <Text style={{fontSize:15,fontWeight:'600'}}>{exchage_from_data[drop2_key]['f_text']} {exchage_from_data[drop2_key]['text']}</Text>
                                    <Text style={{fontSize:12}}>{exchage_from_data[drop2_key]['value']} {exchage_from_data[drop2_key]['f_text']} | ${exchage_from_data[drop2_key]['u_v']}</Text>
                                </View>
                                <View style={{textAlign:'right', width:'15%'}}>
                                    {drop2_flag ? (
                                        <Ionicons name="caret-up-outline" style={{marginTop:13,marginRight:15,textAlign:'right'}} size={20} color="black" />
                                    ) : (
                                        <Ionicons name="caret-down-outline" style={{marginTop:13,marginRight:15,textAlign:'right'}} size={20} color="black" />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                        {drop2_flag &&
                        <View style={{position:'absolute', width:'100%',top:110, zIndex:999999}}>
                            {exchage_from_data.map((item, index) => 
                                <View >
                                    <TouchableOpacity onPress={() => this.setState({drop2_flag:false,drop2_key:index})}>
                                        <View style={{width:'100%',paddingLeft:20,paddingRight:20,paddingTop:6,paddingBottom:6,borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'black',backgroundColor:'white', flexDirection:'row'}}>
                                            <View style={{width:'20%'}}>
                                                <Image source={item['image']} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                            </View>
                                            <View style={{width:'80%', alignSelf:'center'}}>
                                                <Text style={{fontSize:15,fontWeight:'600'}}>{item.f_text} {item.text}</Text>
                                                <Text style={{fontSize:12}}>{item.value} {item.f_text} | ${item.u_v}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        }
                    </View>
                    
                    <View style={{marginTop:20}}>
                        <Text style={{fontSize:14,color:darkmode?'white':'black',marginBottom:20}}>Buy now</Text>
                        <View style={{flexDirection:'row'}}>
                            <TextInput style={{width:'38%',height:50,backgroundColor:'white',borderWidth:1,borderColor:'black'}} />
                            <View style={{width:'12%', backgroundColor:'white', alignSelf:'center', alignItems:'center', borderWidth:0.5, borderColor:'black',height:50}}>
                                <Image source={exchage_from_data[drop1_key]['image']} style={{width:30,height:30,alignItems:'center',alignSelf:'center', marginTop:10}} />
                            </View>
                            <TextInput style={{width:'38%',height:50,backgroundColor:'white',borderWidth:1,borderColor:'black'}} />
                            <View style={{width:'12%', backgroundColor:'white', alignSelf:'center', alignItems:'center', borderWidth:0.5, borderColor:'black',height:50}}>
                                <Ionicons name="logo-usd" style={{marginTop:7}} size={30} color="black" />

                            </View>
                        </View>
                    </View>

                    <View style={{marginTop:20}}>
                        <Text style={{fontSize:14,color:darkmode?'white':'black',marginBottom:20}}>Receive</Text>
                        <View style={{flexDirection:'row'}}>
                            <TextInput style={{width:'38%',height:50,backgroundColor:'white',borderWidth:1,borderColor:'black'}} />
                            <View style={{width:'12%', backgroundColor:'white', alignSelf:'center', alignItems:'center', borderWidth:0.5, borderColor:'black',height:50}}>
                                <Image source={exchage_from_data[drop2_key]['image']} style={{width:30,height:30,alignItems:'center',alignSelf:'center', marginTop:10}} />
                            </View>
                            <TextInput style={{width:'38%',height:50,backgroundColor:'white',borderWidth:1,borderColor:'black'}} />
                            <View style={{width:'12%', backgroundColor:'white', alignSelf:'center', alignItems:'center', borderWidth:0.5, borderColor:'black',height:50}}>
                                <Ionicons name="logo-usd" style={{marginTop:7}} size={30} color="black" />

                            </View>
                        </View>
                    </View>
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
