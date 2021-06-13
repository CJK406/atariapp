import * as React from 'react';
import { BackHandler,StyleSheet, ActivityIndicator,Text, View, FlatList,
    InteractionManager,  Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import {  Header, BalanceList, History } from '../Components';
import { Images } from '../Assets';
import { PieChart } from 'react-native-svg-charts';
import {get_allHistory as get_allHistoryApi,login as loginApi} from '../Api';
import { setAllHistory ,getAllAddress,updateBallance,updateStartScreenState,updateMenuStatus} from '../Redux/Actions';
import PTRView from 'react-native-pull-to-refresh';
// import PTRView from '../Components/PullToRefreshCustom';
import Toast from 'react-native-simple-toast';
const {  height } = Dimensions.get("window");
let backPressed = 0;
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

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.balance != nextState.balance 
                || this.state.history != nextState.history
                || this.state.darkmode != nextState.darkmode
    }
	componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.updateMenuStatus(true);
            if(this.props.pincode===null){
        		this.props.navigation.navigate("SetPincode"); 
            }
            else{
	        	this.props.updateStartScreenState(false);
                this.get_address();  
                if(this.props.all_history===undefined || this.props.all_history.length==0)
                    this.getHistory();
                else{
                    this.setState({history_finish:true});
                }
            }
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    
	componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    handleBackButton = () => {
		if(backPressed > 0){
			BackHandler.exitApp();
			backPressed = 0;
		}else {
			backPressed++;
			Toast.show('Press again to exit.', Toast.SHORT);
			setTimeout( () => { backPressed = 0}, 2000);
			return true;
		}

		return true;
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
        const history = await get_allHistoryApi();
         this.setState({
            history:history.body.arr,
            history_finish:true
         });
        this.props.setAllHistory(history.body.arr);
    }
    refresh(){
        this.setState({
            history:[],
            history_finish:false,
		}, () => {
            this.getHistory();
			this.props.updateBallance();
		});
       
    }
    commafy( num ) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
     }
    
  render() {
        const {balance,darkmode,history_finish,history} = this.state;

        let data = [balance.atri_usd,balance.btc_usd,balance.eth_usd,balance.ltc_usd,balance.usdt_usd];
        if(balance.atri_usd===0 && balance.btc_usd===0 && balance.eth_usd===0 && balance.ltc_usd===0 && balance.usdt_usd===0)
            data = [1,0,0,0,0];
        const color_data = ['#ce2424','#f7931a','aqua','#345c9c','rgb(80,175,149)','rgb(19,181,236))','rgb(243,186,46)',];
        const getColor = (key) => color_data[key];
        const pieData = data.map((value, index) => ({
            value,
                svg: {
                    fill: getColor(index),
                },
				key: `pie-${index}`,
				innerRadius:'10%',
                outerRadius: '10%'
            }))

        const themeBG = darkmode? 'black' : 'white'
        const txtColor = darkmode ? CustomStyles.d_text : CustomStyles.w_text
        const renderItem = ({ item }) => (
            <View style={[CustomStyles.container, styles.innerContainer]}>
            <Header darkmode={darkmode}/>
            <View style={{...CustomStyles.innerContainer,...styles.balanceContainer}}>
                <Text style={{fontSize: 17,justifyContent:'center', alignItems:'center',alignSelf:'center', marginBottom: 100, ...txtColor}}>
                    Total Balance{' '}
                </Text>
                <Text style={{fontSize: 16, justifyContent:'center', alignItems:'center',alignSelf:'center', marginBottom: -140, ...txtColor}}>
                    ${this.commafy(balance.sum.toFixed(2))}
                </Text>
                <View style={{marginTop:10}}>
                    
                    <View style={{marginTop:0}}>
                        {this.state.balance != null ? (
                            <PieChart style={{ height: 180, marginTop: 30 }} data={pieData} innerRadius="95%"/>
                        ) : (
                            <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    marginTop: '40%',
                                }}>
                                <ActivityIndicator size="large" color={darkmode ? 'white' : 'black'} />
                            </View>
                        )}
                    </View>
                    
                    <View style={{flex:1, flexDirection:'row',
                            justifyContent:"center",
                            
                        }}>
                        
                        <View style={{flexDirection:'column', marginRight:16}}>
                            <BalanceList
                                darkmode={darkmode}
                                balance={this.state.balance.atri.toFixed(4)}
                                label={'ATRI'}
                                icon={Images.Atri_icon}
                                iconColor={color_data[0]}
                            />
                           
                            <BalanceList
                                darkmode={darkmode}
                                balance={this.state.balance.eth.toFixed(8)}
                                label={'ETH'}
                                icon={Images.Eth_icon}
                                iconColor={color_data[2]}
                            />

                            <BalanceList
                                darkmode={darkmode}
                                balance={this.state.balance.usdt.toFixed(6)}
                                label={'USDT'}
                                icon={Images.bch_icon}
                                iconColor={color_data[4]}
                            />
                        </View>
                        <View style={{flexDirection:'column', marginLeft:16}}>
                            <BalanceList
                                darkmode={darkmode}
                                balance={this.state.balance.btc.toFixed(8)}
                                label={'BTC'}
                                isIcon
                                icon="bitcoin"
                                iconColor={color_data[1]}
                            />
                             <BalanceList
                                darkmode={darkmode}
                                balance={'0.00000000'}
                                label={'BNB'}
                                icon={Images.bnb_icon}
                                iconColor={color_data[6]}
                            />
                            <BalanceList
                                darkmode={darkmode}
                                balance={this.state.balance.ltc.toFixed(8)}
                                label={'LTC'}
                                icon={Images.Ltc_icon}
                                iconColor={color_data[3]}
                            />
                           
                        </View>
                    </View>
                </View>
            </View>
            <History label={'History'} data={history} darkmode={darkmode}
                isLoad={!history_finish}/>
        </View>
    
          );
    return (
        <PTRView onRefresh={() => this.refresh()} style={{ backgroundColor: themeBG}}>
            {/* <ImageBackground style={{alignItems: 'center', flex: 1,}} source={darkmode ? Images.dashboard_background : null} > */}
            {darkmode && 
                <Image 
                    resizeMode="contain"
                    style={{
                        resizeMode:"cover", 
                        position:"absolute", 
                        top:0, 
                        bottom:0, 
                        flex: 1,
                        alignSelf: 'stretch',
                        width: '100%',
                        height: height,
                    }} 
                source={Images.dashboard_background}/>
            }
            <FlatList
                data={[1]}
                renderItem={renderItem}
            />
            {/* </ImageBackground> */}
        </PTRView>);
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
	},
    balanceContainer:{
        paddingBottom: 20,
        paddingLeft: 20,
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
