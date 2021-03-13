import * as React from 'react';
import { BackHandler,StyleSheet, ActivityIndicator,Text, Image, TouchableOpacity, View, ScrollView, Alert,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogoBox } from '../Components';
import { Images } from '../Assets';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';
import { PieChart } from 'react-native-svg-charts';
import {get_allHistory as get_allHistoryApi,login as loginApi} from '../Api';
import { setAllHistory ,getAllAddress,updateBallance,updateStartScreenState,updateMenuStatus} from '../Redux/Actions';
import PTRView from 'react-native-pull-to-refresh';
class DashboardScreen extends React.Component {
    state = {
        balance:null,
        history_finish:false,
        darkmode:true,
        pincode:null,
        history:[],
        get_address:{atri:"",btc:"",eth:"",ltc:"",bch:"",flag:false},
        interval:null,
	}
	componentDidMount() {

		this._unsubscribe = this.props.navigation.addListener('focus', () => {
	        // this.props.updateMenuStatus(false);
            BackHandler.addEventListener('hardwareBackPress', function(){
                return true;
            });
            if(this.props.pincode===null){
        		this.props.navigation.navigate("SetPincode");
            }
            else{
	        	this.props.updateStartScreenState(false);
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
    componentWillMount(){
		BackHandler.addEventListener('hardwareBackPress', function(){
			return true;
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
        history:props.all_history,
        get_address:props.get_address,
    };
  }
	
    get_address(){
        this.props.getAllAddress();
    }

	getHistory = async () => {
        console.log("start get history");

        const history = await get_allHistoryApi();
        console.log("end get history");
        this.setState({
            history:history.result,
            history_finish:true
        });
        this.props.setAllHistory(history.result);
    }
    refresh(){
        console.log("asef");
        this.setState({
            history:[],
            history_finish:false,
		}, () => {
            this.getHistory();
			this.props.updateBallance();
		});
       
    }
  render() {
        const {balance,darkmode,history_finish,history} = this.state;
        let data = [balance.atri_usd,balance.btc_usd,balance.eth_usd,balance.ltc_usd,balance.bch_usd];
        if(balance.atri_usd===0 && balance.btc_usd===0 && balance.eth_usd===0 && balance.ltc_usd===0 && balance.bch_usd===0)
            data = [1,0,0,0,0];
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
        <PTRView onRefresh={() => this.refresh()} style={{backgroundColor:darkmode?'rgb(33,33,33)':'white'}} >

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
                            <View style={{width:'45%'}}>
                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <FontawesomeIcon name="bitcoin" style={{marginTop:13,marginRight:15}} size={20} color="#f7931a" />
                                    <View style={{flexDirection:'row',marginLeft:'auto'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.btc.toFixed(8)}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'flex-end', marginTop:10,textAlign:'right'}]}>BTC</Text> 
                                    </View>
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.Atri_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    <View style={{flexDirection:'row',marginLeft:'auto'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.atri.toFixed(4)}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>ATRI</Text> 
                                    </View>
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.Eth_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    <View style={{flexDirection:'row',marginLeft:'auto'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.eth.toFixed(8)}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>ETH</Text> 
                                    </View>
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.Ltc_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    <View style={{flexDirection:'row',marginLeft:'auto'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.ltc.toFixed(8)}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>LTC</Text> 
                                    </View>
                                
                                </View>

                                <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                    <Image source={Images.bch_icon} style={{width:20, height:20, marginTop:13,marginRight:10}} />
                                    {/* <FontawesomeIcon name="bitcoin" style={{marginTop:13,marginRight:15}} size={20} color="green" /> */}
                                    {/* <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>{this.state.balance.bch.toFixed(5)}</Text> */}
                                    <View style={{flexDirection:'row',marginLeft:'auto'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10,marginRight:5, width:100,textAlign:'right'}]}>0.00</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{justifyContent:'center', marginTop:10}]}>USDT</Text> 
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'50%'}}>
                                {this.state.balance!=null ? (
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

                    <View style={{padding:20,paddingBottom:75, color:darkmode ? 'white':'black'}}>
                        <Text style={{fontSize:16,color:darkmode ? 'white':'black',marginBottom:10}}>History</Text>
                        {!history_finish && 
                            <ActivityIndicator size="large" color={darkmode ? "white" :"black"} />
                        }
                        
                            {history.map((item, index) => 
                                <View  key={index}>
                                {history_finish && 

                                <View style={{marginBottom:15, flexDirection:'row'}}>
                                    <View style={{width:'12%', alignItems:'center',alignSelf:'center'}}>
                                        <Ionicons name={item.type==="received" ? "arrow-down-circle-outline" : "arrow-up-circle-outline"} style={{marginRight:15}} size={25} color={darkmode ? "white" :"black"} />
                                    </View>
                                    <View style={{width:'44%'}}>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:15}]}>{item.type==="received" ? "Received" : "Sent"}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{color:'white',fontSize:11}]}>{item.created_at}</Text>
                                    </View>
                                    <View style={{width:'44%'}}>
                                        <Text style={{color:item.type==="received" ? 'rgb(70,155,74)': 'rgb(244,67,54)',fontSize:15,textAlign:'right'}}>{item.amount} {item.currency.toUpperCase()}</Text>
                                        <Text style={[darkmode?CustomStyles.d_text:CustomStyles.w_text,{fontSize:15,textAlign:'right'}]}>${item.amount_usd}</Text>
                                    </View>
                                </View> 
                                }
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
        all_history:state.Auth.all_history,
        get_address:state.Auth.get_address,
        
  };
}

export default connect(mapStateToProps, {setAllHistory,getAllAddress,updateBallance,updateStartScreenState,updateMenuStatus})(withTheme(DashboardScreen));
