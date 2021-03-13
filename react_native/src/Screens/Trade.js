import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image,ActivityIndicator,TouchableHighlight, Dimensions,View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles,Headers } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Logo from '../Assets/logo.png';
import QRCode from 'react-native-qrcode-svg';
import { AreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import Modal from 'react-native-modal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { TextInput } from 'react-native-gesture-handler';
import { get_History as get_HistoryApi, get_Graph} from '../Api';
import Clipboard from '@react-native-community/clipboard';
import PTRView from 'react-native-pull-to-refresh';
import { Images } from '../Assets';

class TradeScreen extends React.Component {
	state = {
		currentTab: 0,
		currentPeriodIndex:'1h',
		show_receive_modal:false,
		show_send_modal:false,
		qr_code_modal:false,
		show_comingsoon_modal:false,
		balance:null,
		usd_val:0,
		history:[],
		history_finish:false,
		chart_data:{x:[],y:[],min:0,max:0},
		percentage:0,
		send_address:"",
		send_usd_amount:"0.00",
		send_amount:"0.00",
		darkmode:true,
		get_address:{atri:"",btc:"",eth:"",ltc:"",bch:"",flag:false},
		price:null,
		

	}
	componentDidMount() {
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.format();
			this.getHistory();
			this.getGraphData();
		});
	}
	componentWillUnmount() {
        this._unsubscribe();
  	}
	static getDerivedStateFromProps(props, state) {
		return {
			balance:props.balance,
			darkmode:props.darkmode,
			get_address:props.get_address,
			price:props.price,
		};
	}
	format(){
		this.setState({
			currentTab: 0,
			currentPeriodIndex:'1h',
			show_receive_modal:false,
			show_send_modal:false,
			qr_code_modal:false,
			history:[],
			history_finish:false,
			chart_data:{x:[],y:[],min:0,max:0},
			percentage:0,
			send_address:"",
			send_usd_amount:"0.00",
			send_amount:"0.00",
		})
	}
	getHistory = async () => {
		const {currentTab} = this.state;
		const history = await get_HistoryApi(Headers[currentTab]['text'].toLowerCase());
		this.setState({
			history:history.result,
			history_finish:true,
		})
	}
	getGraphData = async () => {
		const {currentTab,currentPeriodIndex,chart_data} = this.state;
		const graph_data = await get_Graph(Headers[currentTab]['text'].toLowerCase(),currentPeriodIndex);
		const graph_result = graph_data.data;
		let min = graph_result[0]['value'];
		let max = 0;
		for(var i=0; i<graph_result.length; i++){
			chart_data.x.push(graph_result[i]['date']);
			chart_data.y.push(graph_result[i]['value']);
			if(graph_result[i]['value']<min)
				min = 	graph_result[i]['value'];
			if(graph_result[i]['value'] > max)
				max = graph_result[i]['value'];
		}
		chart_data.min=min;
		chart_data.max=max;
		this.setState({
			chart_data:chart_data
		});
	}
	setTab = (index) => {
		if(index===4){
			this.setState({show_comingsoon_modal:true});
		}
		else{
			this.setState({
				currentTab: index,
				currentPeriodIndex:'1h',
				usd_val:0,
				history:[],
				chart_data:{x:[],y:[],min:0,max:0},

				percentage:0,
				send_usd_amount:"0.00",
				send_amount:"0.00",
			}, () => {
				this.getHistory();
				this.getGraphData();
			});
		}
		
	}
	setPeriod = (period) =>{
		this.setState({
			currentPeriodIndex:period,
			chart_data:{x:[],y:[],min:0,max:0},

		}, () => {
			this.getGraphData();
		});
	}
	toggleModal = () => {
		this.setState({
			show_receive_modal:!this.state.show_receive_modal
		});
	}
	toggleSendModal = () => {
		this.setState({
			show_send_modal:!this.state.show_send_modal
		})
	}
	SendConfirm = () => {
		const {send_usd_amount, send_amount, send_address, currentTab} = this.state;
		if(send_address!=="" && send_amount!=="0.00"){
			this.setState({
				show_send_modal:!this.state.show_send_modal
			})
			let info= {send_usd_amount:send_usd_amount,send_amount:send_amount, address:send_address, currentTab:currentTab}
			this.props.navigation.navigate('SendConfirm',{ info: info });
		}
	}
	onSuccess = async e => {
		let split = e.data.split(":");
		let address = split.length>1 ? split[1]:split[0];
		this.setState({
			send_address:address,
			qr_code_modal:false
		})
	};
	changeSendUsdValue(e){
		const {currentTab,balance,get_address,price} =this.state;
		const currency_data = [['btc',balance.btc,'#f7931a',balance.btc_usd,get_address.btc],
								['atri',balance.atri,'#c42626',balance.atri_usd,get_address.atri],
								['eth',balance.eth,'aqua',balance.eth_usd,get_address.eth],
								['ltc',balance.ltc,'#345c9c',balance.ltc_usd,get_address.ltc],
								['bch',balance.bch,'green',balance.bch_usd,get_address.bch]];
		let send_amount1 = e!=="" ?  (parseFloat(e)/parseFloat(price[currency_data[currentTab][0]])).toFixed(5) : "0.00";
		this.setState({
			send_amount:send_amount1,
			send_usd_amount:e
		})
	}
	changeSendValue(e){
		const {currentTab,balance,get_address,price} =this.state;
		const currency_data = [['btc',balance.btc,'#f7931a',balance.btc_usd,get_address.btc],
								['atri',balance.atri,'#c42626',balance.atri_usd,get_address.atri],
								['eth',balance.eth,'aqua',balance.eth_usd,get_address.eth],
								['ltc',balance.ltc,'#345c9c',balance.ltc_usd,get_address.ltc],
								['bch',balance.bch,'green',balance.bch_usd,get_address.bch]];
		let send_amount1 = e!=="" ?  (parseFloat(e)*parseFloat(price[currency_data[currentTab][0]])) : 0;
		console.log(parseFloat(currency_data[currentTab][3]))
		this.setState({
			send_usd_amount:send_amount1.toFixed(2),
			send_amount:e
		})
	}
	focusSendInput = async() => {
		console.log("aef");
		const text = await Clipboard.getString();
		console.log(text);
		this.setState({
			send_address:text
		})
	};
	setFullBallance(){
		const {balance,currentTab,get_address,price} = this.state;
		const currency_data1 = [['btc',balance.btc,'#f7931a',balance.btc_usd,get_address.btc,8],
			['atri',balance.atri,'#c42626',balance.atri_usd,get_address.atri,4],
			['eth',balance.eth,'aqua',balance.eth_usd,get_address.eth,8],
			['ltc',balance.ltc,'#345c9c',balance.ltc_usd,get_address.ltc,8],
			['bch',balance.bch,'green',balance.bch_usd,get_address.bch,6]];
		let full_balance = currency_data1[currentTab][1];
		let send_amount1 =currency_data1[currentTab][3];
		this.setState({
			send_amount:full_balance.toFixed(currency_data1[currentTab][5]),
			send_usd_amount:send_amount1.toFixed(2)
		})
	}
	refresh(){
		this.setState({
			history:[],
			chart_data:{x:[],y:[],min:0,max:0},

		}, () => {
			this.getHistory();
			this.getGraphData();
		});
	}
  render() {
		const { currentTab,currentPeriodIndex,balance,chart_data,darkmode,get_address,price } = this.state;
		const currency_data = [['btc',balance.btc,'#f7931a',balance.btc_usd,get_address.btc,8],
								['atri',balance.atri,'#c42626',balance.atri_usd,get_address.atri,4],
								['eth',balance.eth,'aqua',balance.eth_usd,get_address.eth,8],
								['ltc',balance.ltc,'#345c9c',balance.ltc_usd,get_address.ltc,8],
								['bch',balance.bch,'green',balance.bch_usd,get_address.bch,6]];
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white' }}>
          <PTRView onRefresh={()=>this.refresh()} >

		  	<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{height: 70, alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor:darkmode?'black':'white', width:'100%'}}>
					<Image source={Logo} style={{width:160, height:50}} />
				</View>
				<View style={{backgroundColor:darkmode?'black':'white',paddingBottom:10}}>
					<Text style={{color:darkmode?'white':'black', alignSelf:'center', alignItems:'center'}}>Total Balance</Text>
					<Text style={{color:darkmode?'white':'black', alignSelf:'center', alignItems:'center'}}>${balance.sum.toFixed(2)}</Text>
				</View>
				<View style={[{height: 44, marginLeft: -15, marginRight: -15, alignItems: 'center', flexDirection: 'row', backgroundColor: darkmode?'black':'white'}, styles.topTabBar]}>
					{Headers.map((item, index) => <TouchableHighlight onPress={() => this.setTab(index)} style={[styles.topTab, currentTab === index && styles.activeTab]} key={index}>
						<Image source={item.Image} style={{width:25, height:25, alignItems:'center',alignSelf:'center'}}></Image>							
					</TouchableHighlight>)}
				</View>
				<View >
					<Text style={{color:darkmode?'white':'black',fontSize:15,alignItems:'center',alignSelf:'center',marginTop:20}}>Current Balance</Text>
					<View style={{flexDirection:'row'}}>
						<View style={{width:'20%'}}>
							<TouchableHighlight onPress={() => this.toggleModal()} style={{backgroundColor:'#ce2424',borderTopRightRadius:100,borderBottomRightRadius:100, height:48,marginTop:40,paddingLeft:5,paddingTop:5}}>
								<View>
									<Ionicons name='trending-down-outline'  size={20} color="white" />
									<Text style={{fontSize:12,color:'white'}}>Receive</Text>
								</View>
							</TouchableHighlight>
						</View>
						<View style={{width:'60%'}}>
							<Text style={{fontSize:23,marginTop:20,color:darkmode?'white':'black',alignSelf:'center'}}>{currency_data[currentTab][1].toFixed(currency_data[currentTab][5])} {Headers[currentTab]['text']}</Text>
							<Text style={{fontSize:20,marginTop:5,color:darkmode?'white':'black',alignSelf:'center'}}>${currency_data[currentTab][3].toFixed(2)}</Text>
						</View>
						<View style={{width:'20%'}}>
						<TouchableHighlight onPress={() => this.toggleSendModal()} style={{alignItems:'flex-end',backgroundColor:'#ce2424',borderTopLeftRadius:100,borderBottomLeftRadius:100, height:48,marginTop:40,paddingRight:5,paddingTop:5}}>
								<View>
									<Ionicons name='trending-up-outline' size={20} style={{alignItems:'flex-end',alignItems:'flex-end',textAlign:'center'}} color="white" />
									<Text style={{fontSize:12,color:'white'}}>Send</Text>
								</View>
							</TouchableHighlight>
						</View>
					</View>
					<View style={{flexDirection:'row',marginTop:10,alignSelf:'center',alignItems:'center'}}>
						<Text style={{color:Headers[currentTab]['color'],fontSize:19}}>{Headers[currentTab]['text']} ${price[currency_data[currentTab][0]].toFixed(2)}</Text>
						{/* <View style={{backgroundColor:Headers[currentTab]['color'],padding:5,borderRadius:20,marginLeft:10}}><Text style={{fontWeight:'700'}}>{chart_data.y.length>0 ? ((chart_data.max-currency_data[currentTab][3])/chart_data.average*100).toFixed(2) : '0.00'}%</Text></View> */}
						<View style={{backgroundColor:Headers[currentTab]['color'],padding:5,borderRadius:20,marginLeft:10}}><Text style={{fontWeight:'700'}}>{chart_data.y.length>0 ? ((price[currency_data[currentTab][0]]-chart_data.y[0])/chart_data.y[chart_data.y.length-1]*100).toFixed(2) : '0.00'}%</Text></View>
					</View>
				</View>
				<View style={{height:130}}>
					{chart_data.y.length>0 ? (
						<AreaChart
							style={{ height: 130 }}
							data={chart_data.y}
							contentInset={{ top: 30, bottom: 30 }}
							curve={shape.curveNatural}
							svg={{ fill: currency_data[currentTab][2]}}
						>
						</AreaChart>
					):
					(
						<View style={{marginTop:50}}>
							<ActivityIndicator size="large" color={darkmode?"white":'black'} />
						</View>
					)}
				</View>
				<View style={{flexDirection:'row',alignSelf:'center',alignItems:'center', textAlign:'center',justifyContent:'center', borderBottomColor:darkmode?'white':'black', borderBottomWidth:1, width:'100%', paddingBottom:30,marginTop:20}}>
					<TouchableOpacity onPress={() => this.setPeriod('1h')} style={[currentPeriodIndex==='1h' ? {backgroundColor:'#d24646'} : {backgroundColor:'#c42626'}, { borderRadius:5,width:'21%',height:29,marginLeft:10, borderWidth:0.8,borderColor:'white',alignItems:'center',alignSelf:'center',justifyContent:'center'}]}>
						<Text style={{color:'white',fontSize:11}}>1 hour</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() =>this.setPeriod('1d')} style={[currentPeriodIndex==='1d' ? {backgroundColor:'#d24646'} : {backgroundColor:'#c42626'},{borderRadius:5,width:'21%',height:29,marginLeft:10, borderWidth:0.8,borderColor:'white',alignItems:'center',alignSelf:'center',justifyContent:'center'}]}>
						<Text style={{color:'white',fontSize:11}}>24 hour</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.setPeriod('7d')} style={[currentPeriodIndex==='7d' ? {backgroundColor:'#d24646'} : {backgroundColor:'#c42626'},{borderRadius:5,width:'21%',height:29,marginLeft:10, borderWidth:0.8,borderColor:'white',alignItems:'center',alignSelf:'center',justifyContent:'center'}]}>
						<Text style={{color:'white',fontSize:11}}>7days</Text>
					</TouchableOpacity>
				</View>
				<View style={{padding:20, color:'white',paddingBottom:70}}>
				<Text style={{fontSize:16,color:darkmode?'white':'black',marginBottom:10}}>Activity</Text>
				{!this.state.history_finish && 
					<ActivityIndicator size="large" color={darkmode?"white":'black'}  />
				}
				{this.state.history.map((item, index) => 
					<View style={{marginBottom:15, flexDirection:'row'}} key={index}>
						<View style={{width:'12%', alignItems:'center',alignSelf:'center'}}>
							<Ionicons name={item.type==="received" ? "arrow-down-circle-outline" : "arrow-up-circle-outline"} style={{marginRight:15}} size={26} color={darkmode?"white":'black'}  />
						</View>
						<View style={{width:'44%'}}>
							<Text style={{color:darkmode?'white':'black',fontSize:15}}>{item.type==="received" ? "Received" : "Sent"}</Text>
							<Text style={{color:darkmode?'white':'black',fontSize:11}}>{item.created_at}</Text>
						</View>
						<View style={{width:'44%'}}>
							<Text style={{color:item.type==="received" ? 'rgb(70,155,74)': 'rgb(244,67,54)',fontSize:15,textAlign:'right'}}>{item.amount} {item.currency.toUpperCase()}</Text>
							<Text style={{color:darkmode?'white':'black',fontSize:15,textAlign:'right'}}>${item.amount_usd}</Text>
						</View>
					</View> 
				)}
			</View>
			<Modal isVisible={this.state.show_receive_modal}
				onBackdropPress={() => this.toggleModal(false)}
				style={{margin:0}}
			>
				<View style={{ backgroundColor:darkmode?'rgb(33,33,33)':'white',borderRadius:10,top:'30%',width:'100%',margin:0,borderTopRightRadius:50,borderTopLeftRadius:50}}>
					<Text style={{fontSize:30, color:darkmode?'white':'black',textAlign:'center',marginTop:20,marginBottom:20}}>Address</Text>
					<View style={{flexDirection:'row',textAlign:'center',justifyContent:'center'}}>
						<TextInput editable = {false} style={{backgroundColor:'transparent',width:'90%',height:50,borderBottomWidth:1,borderBottomColor:darkmode?'white':'black',color:darkmode?'white':'black'}}>{currency_data[currentTab][4]}</TextInput>
						<TouchableOpacity  onPress={()=> {Clipboard.setString(currency_data[currentTab][4])}}>
							<Ionicons name='documents-outline'  size={20} color={darkmode?"white":'black'} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />

						</TouchableOpacity>
					</View>
					<View style={{textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:0,marginBottom:30,height:250,paddingBottom:30}}>
						{currency_data[currentTab][4]!=="" && (
							<QRCode
							value={Headers[currentTab]['full_text']+":"+currency_data[currentTab][4]}
							logo={Headers[currentTab]['Image']}
							logoSize={40}
							size={170}
							backgroundColor={"white"}
							quietZone={10}
							logoMargin={2}
						/>
						)}
						
					</View>
				</View>
			</Modal>

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
			<Modal
				isVisible={this.state.show_send_modal}
				onBackdropPress={() => this.toggleSendModal(false)}
				style={{margin:0}}
				>
				<View style={{ backgroundColor:darkmode?'rgb(33,33,33)':'white',borderRadius:10,top:'30%',width:'100%',margin:0,borderTopRightRadius:50,borderTopLeftRadius:50}}>
					<Image source={Headers[currentTab]['Image']} style={{width:25,height:25,marginTop:20,justifyContent:'center',alignItems:'center',alignSelf:'center'}}></Image>
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
							<Text style={{color:darkmode?'white':'black',fontSize:24}}>{Headers[currentTab]['text']}</Text>
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
						<Text style={{color:darkmode?'white':'black',fontSize:20,marginTop:20}}>*Available: {currency_data[currentTab][1]} {Headers[currentTab]['text']}</Text>
						<TouchableOpacity 
							style={{marginTop:25,borderWidth:1,borderColor:'white',justifyContent:'center',alignItems:'center',alignSelf:'center',marginLeft:20,padding:5,borderRadius:10,backgroundColor:'rgb(227,30,45)',width:50,height:25,textAlign:'right'}} 
							onPress={() =>this.setFullBallance()} >
							<Text style={{color:'white'}}>Full</Text>	
						</TouchableOpacity>
					</View>
					<View style={{flexDirection:'row',textAlign:'center',justifyContent:'center',marginBottom:30,marginTop:40}}>
						<TextInput placeholder="Tap to paste address" 
							onChangeText={(key) => this.setState({send_address:key})} 
							onFocus={() =>this.focusSendInput()}
							placeholderTextColor={darkmode?"white":"black"} 
							style={{backgroundColor:'transparent',color:darkmode?'white':'black',width:'90%',height:50,borderBottomWidth:1,borderBottomColor:darkmode?'white':'black'}} >
							{this.state.send_address}
						</TextInput>
						<TouchableOpacity onPress={() =>this.setState({qr_code_modal:true})} style={{marginTop:20}} >
							<Ionicons name='qr-code-outline'  size={20} color={darkmode?"white":'black'} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => this.SendConfirm()} 
						style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:200,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
					>
						<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Continue</Text>
					</TouchableOpacity>
				</View>
			</Modal>
			<Modal
					isVisible={this.state.show_comingsoon_modal}
					>
					<View style={{ backgroundColor:'white',borderRadius:10}}>
						<Image source={Images.exchange_gif} style={{justifyContent:'center', width:'100%',height:200,marginTop:40}} />
						<Text style={{fontSize:30, textAlign:'center',marginTop:40,marginBottom:20}}>Coming Soon</Text>
						{/* <Text style={{textAlign:'center',padding:20,fontSize:20}}>USDT crypto will be available soon.</Text> */}
						<TouchableOpacity onPress={() => this.setState({show_comingsoon_modal:false})} 
							style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:20,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
						>
							<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>OK</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</ScrollView>
		</PTRView>
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
	},
	topTabBar: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3
	},
	topTab: {
		height: '100%',
		justifyContent: 'center',
		width: '20%'
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#f7931a'
	},
	activeText: {
		color: '#f7931a'
	},
	topTabText: {
		color: '#878A91',
		fontSize: 14
	}
});

function mapStateToProps(state) {
  return {
		balance: state.Auth.balance,
		darkmode: state.Auth.darkmode,
		get_address:state.Auth.get_address,
		price:state.Auth.price,
  };
}

export default connect(mapStateToProps, {  })(withTheme(TradeScreen));
