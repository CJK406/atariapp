import * as React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator,Text, Image, TouchableOpacity, View, ScrollView, Alert,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogoBox } from '../Components';
import { Images } from '../Assets';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';
import { PieChart } from 'react-native-svg-charts';
import { currency_convert as currency_convertApi,get_allHistory as get_allHistoryApi,login as loginApi} from '../Api';
import { authSetUsdBalance,setAllHistory ,getAllAddress} from '../Redux/Actions';
import PTRView from 'react-native-pull-to-refresh';
class DashboardScreen extends React.Component {
    state = {
        balance:{},
        history_finish:false,
        usd_balance:{
            atri:0,
            btc:0,
            eth:0,
            ltc:0,
            bch:0,
            flag:false,
        },
        darkmode:true,
        pincode:"null",
        history:[],
        get_address:{atri:"",btc:"",eth:"",ltc:"",bch:"",flag:false},
        interval:null,
	}
	componentDidMount() {
        console.log("this.props.pincode",this.props.pincode);
		this._unsubscribe = this.props.navigation.addListener('focus', () => {

            if(this.props.pincode===null){
        		this.props.navigation.navigate("SetPincode");
            }
            else{
                if(this.props.usd_balance.flag===false){
                   this.currentConvert();
                }
                if(this.props.all_history.length==0)
                    this.getHistory();
                else{
                    this.setState({history_finish:true});
                }
                if(this.state.interval!==null)
                    clearInterval(this.state.interval);

                this.get_address();
                this.state.interval = setInterval(() => {
                    this.get_address();
                }, 300000)
                
            }
            
        });
    }
	componentWillUnmount() {
        this._unsubscribe();
    }
  static getDerivedStateFromProps(props, state) {
    return {
        balance:props.balance,
        darkmode:props.darkmode,
        pincode:props.pincode,
        usd_balance:props.usd_balance,
        history:props.all_history,
        get_address:props.get_address,
    };
  }
	currentConvert = async () => {
        let usd_balance = this.state.usd_balance;
        usd_balance.flag=false;
        this.setState({usd_balance:usd_balance});
        const btc_usd = await currency_convertApi('btc',1);
        const atri_usd = await currency_convertApi('atri',1);
        const eth_usd = await currency_convertApi('eth',1);
        const ltc_usd = await currency_convertApi('ltc',1);
        const bch_usd = await currency_convertApi('bch',1);

        usd_balance.atri = atri_usd.result;
        usd_balance.btc = btc_usd.result;
        usd_balance.eth = eth_usd.result;
        usd_balance.ltc = ltc_usd.result;
        usd_balance.bch = bch_usd.result;
        usd_balance.flag=true;

        this.setState({usd_balance:usd_balance});
        this.props.authSetUsdBalance(usd_balance);

    }
    get_address(){
        this.props.getAllAddress();
    }

	getHistory = async () => {
        const history = await get_allHistoryApi();
        this.setState({history:history.result,history_finish:true});
        this.props.setAllHistory(history.result);
    }
    refresh(){
        this.setState({
            history:[],
            history_finish:false,
            usd_balance:{
                atri:0,
                btc:0,
                eth:0,
                ltc:0,
                bch:0,
                flag:false,
            },
		}, () => {
            this.currentConvert();
            this.getHistory();
		});
       
    }
  render() {
        const {balance,usd_balance,darkmode} = this.state;
        const data = [usd_balance.atri*balance.atri,usd_balance.btc*balance.btc,usd_balance.eth*balance.eth,usd_balance.ltc*balance.ltc,usd_balance.bch*balance.bch];
        const color_data = ['rgb(244,67,54)','rgb(242,169,0)','aqua','#345c9c','rgb(0,128,0)'];
        const getColor = (key) => color_data[key];
        const pieData = data.map((value, index) => ({
            value,
                svg: {
                    fill: getColor(index),
                },
				key: `pie-${index}`,
				innerRadius:'20%'
            }))
    return (
        <PTRView onRefresh={()=>this.refresh()} style={{backgroundColor:darkmode?'rgb(33,33,33)':'white'}} >

            <ScrollView nestedScrollEnabled={true} style={{...CustomStyles.container, backgroundColor: darkmode? 'rgb(33,33,33)' : 'white' }} >
                <View style={[CustomStyles.container, styles.innerContainer]}>
                    <View style={[darkmode ? CustomStyles.d_back : CustomStyles.w_back,{height: 70, alignItems: 'center', justifyContent: 'center', position: 'relative',width:'100%'}]}>
                        <LogoBox style={{position: 'absolute', left: 0}}/>
                        <Image source={Images.Logo} style={{width:160, height:50}} />
                    </View>

                    <View style={[CustomStyles.innerContainer], {backgroundColor:darkmode?'black':'white',paddingBottom:20,paddingLeft:20}}>
                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:17,marginBottom:10}]}>Total Balance </Text>
                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:16,marginBottom:15}]}>${balance.sum.toFixed(2)}</Text>
                        <View style={{flexDirection:'row'}}>
                            <View style={{width:'50%'}}>
                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <FontawesomeIcon name="bitcoin" style={{marginTop:13,marginRight:15}} size={20} color="#f7931a" />
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.btc.toFixed(5)}</Text>
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>BTC</Text> 
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.Atri_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.atri.toFixed(2)}</Text>
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>ATRI</Text> 
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.Eth_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.eth.toFixed(5)}</Text>
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>ETH</Text> 
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.Ltc_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.ltc.toFixed(5)}</Text>
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>LTC</Text> 
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <FontawesomeIcon name="bitcoin" style={{marginTop:13,marginRight:15}} size={20} color="green" />
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.bch.toFixed(5)}</Text>
                                    <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>BCH</Text> 
                                </View>
                            </View>
                            <View style={{width:'50%'}}>
                                {this.state.usd_balance.flag ? (
                                    <PieChart style={{ height: 150, marginTop:30 }} data={pieData} innerRadius='80%' />
                                )
                                :
                                (
                                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:'40%'}}>
                                        <ActivityIndicator size="large" color={darkmode?'white':'black'} />
                                    </View>
                                )
                            }
                            </View>
                        </View>
                        
                    </View>

                    <View style={{padding:20,paddingBottom:45, color:darkmode ? 'white':'black'}}>
                        <Text style={{fontSize:16,color:darkmode ? 'white':'black',marginBottom:10}}>History</Text>
                        {!this.state.history_finish && 
                            <ActivityIndicator size="large" color={darkmode ? "white" :"black"} />
                        }
                        
                            {this.state.history.map((item, index) => 
                                <View style={{marginBottom:15, flexDirection:'row'}} key={index}>
                                    <View style={{width:'12%', alignItems:'center',alignSelf:'center'}}>
                                        <Ionicons name={item.type==="received" ? "arrow-down-circle-outline" : "arrow-up-circle-outline"} style={{marginRight:15}} size={25} color={darkmode ? "white" :"black"} />
                                    </View>
                                    <View style={{width:'44%'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:15}]}>{item.type==="received" ? "Received" : "Sent"}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{color:'white',fontSize:11}]}>{item.created_at}</Text>
                                    </View>
                                    <View style={{width:'44%'}}>
                                        <Text style={{color:item.type==="received" ? 'rgb(70,155,74)': 'rgb(244,67,54)',fontSize:15,textAlign:'right'}}>{item.amount.toFixed(4)} {item.currency.toUpperCase()}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:15,textAlign:'right'}]}>${item.amount_usd}</Text>
                                    </View>
                                </View> 
                            )}
                       
                        

                    </View>
                </View>
          
                </ScrollView>
                
      </PTRView>

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
        balance: state.Auth.balance,
        darkmode:state.Auth.darkmode,
        pincode:state.Auth.pincode,
        usd_balance:state.Auth.usd_balance,
        all_history:state.Auth.all_history,
        get_address:state.Auth.get_address
  };
}

export default connect(mapStateToProps, {authSetUsdBalance,setAllHistory,getAllAddress})(withTheme(DashboardScreen));
