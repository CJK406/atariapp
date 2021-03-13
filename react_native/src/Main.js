import React from 'react';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import { View ,BackHandler} from 'react-native';
import {
	StartScreen,
	LoginScreen, ForgotPasswordScreen, SignupScreen,	TradeScreen, DashboardScreen, 
	ProfileScreen,NotificationScreen, ExchangeScreen,SendConfirmScreen,QRScanScreen,SendPaymentScreen,ResetPinScreen,SetPincodeScreen,TestScreen } from './Screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Pusher from 'pusher-js/react-native';
import CurvedNavBar from 'rn-curved-navigation-bar';
import Toast from 'react-native-simple-toast';
const AuthStack = createStackNavigator();
const AuthStackScreens = () => (
	<AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Start">
		<AuthStack.Screen name="Test" component={TestScreen} test_value="aaa" />
		<AuthStack.Screen name="Start" component={StartScreen} />
		<AuthStack.Screen name="Login" component={LoginScreen} />
		<AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
		<AuthStack.Screen name="Signup" component={SignupScreen} />
	</AuthStack.Navigator>
);
const MainStack = createStackNavigator();
const MainTabScreens = () => (
	<MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Start2">
		<MainStack.Screen name="Start2" component={StartScreen} />
		<MainStack.Screen name="Dashboard1" component={DashboardScreen} />
		<MainStack.Screen name="Exchange" component={ExchangeScreen} />
		<MainStack.Screen name="Trade" component={TradeScreen} />
		<MainStack.Screen name="SendConfirm" component={SendConfirmScreen} />
		<MainStack.Screen name="Setting" component={ProfileScreen} />
		<MainStack.Screen name="Notifications" component={NotificationScreen} />
		<MainStack.Screen name="ResetPin" component={ResetPinScreen} />
		<MainStack.Screen name="QRScan" component={QRScanScreen} />
		<MainStack.Screen name="SendPayment" component={SendPaymentScreen} />
		<MainStack.Screen name="SetPincode" component={SetPincodeScreen} />
	</MainStack.Navigator>
);
const RootStack = createStackNavigator();
const RootStackScreens = (info) => (
	<RootStack.Navigator screenOptions={{ headerShown: false }}>
		{info.loggedin
			? <RootStack.Screen name="App" pincode="null" component={MainTabScreens} />
			: <RootStack.Screen name="Auth" component={AuthStackScreens} />
		}
	</RootStack.Navigator>
);
const PusherConfig = {
	appId:"984706",
	key:"55140bd5ad055d0a2d10",
	secret:"a7ed4ac1574e012c701f",
	cluster:"mt1",
	encrypted:true,
}
let unsubscriber = null;
let messageUnsubscriber = null;
class MainApp extends React.Component {
	constructor(props) {
		super(props);
		this.navigationRef = React.createRef();
	}
	state = {
		activeTab: 1,
		page:0,
		menuDelay:false,
		user_id:"",
		loggedin:false,
		pincode:"",
		start_screen_flag:false,
		menustatus:false
	  }
	static getDerivedStateFromProps(props, state) {
		return {
			user_id:props.user_id,
			loggedin:props.loggedin,
			pincode:props.pincode,
			start_screen_flag:props.start_screen_flag,
			menustatus:props.menustatus
		};
	  }
	async componentDidMount() {
		this.setState({menuDelay:true});
	}
	async componentDidUpdate(prevProps) {
		BackHandler.addEventListener('hardwareBackPress', function(){
			return true;
		});
		
	}
	componentWillMount(){
		BackHandler.addEventListener('hardwareBackPress', function(){
			return true;
		});
	}
	componentWillUnmount() {
		if (unsubscriber) unsubscriber(); 
		if (messageUnsubscriber) messageUnsubscriber();
		// BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	setActiveTab(key){
		this.setState({
			activeTab:key
		});
		 this.navigationRef.current?.navigate(this.tabs[key-1].key);
	}
	tabs = [{key: 'Dashboard1'},{key: 'Trade'},{key: 'QRScan'},{key: 'Exchange'},{key: 'Setting'}]
	checkMenuHidden(){
		const { loggedin,pincode,start_screen_flag,menustatus,menuDelay } = this.state;
		if(loggedin && pincode!==null && menuDelay && menustatus){
			return true;
		}
		else
			return false;
	}
	setNotification(){
		const {user_id} = this.state;
		let pusher = new Pusher(PusherConfig.key, PusherConfig);
		let chatChannel = pusher.subscribe('payment-received-'+user_id);
		chatChannel.bind('payment-received-'+user_id, (data) => { // (4)
			Toast.show(data);
		});
	}
  render() {
		const { loggedin} = this.state;
		if(loggedin){
			this.setNotification();
		}
    return (
			<View style={{flex:1, flexDirection:'column'}}>
				<View style={{flex:1}}>
					<NavigationContainer ref={this.navigationRef}>
						<RootStackScreens loggedin={loggedin} />
					</NavigationContainer>
				</View>
					{this.checkMenuHidden() &&<CurvedNavBar mainOffSetAndroid={15} 
					icons={['reader-outline','pulse-outline','qr-code-outline','swap-horizontal-outline','settings-outline']} 
					navColor={'red'}
					iconColor={'white'}
					cb={(id)=>{this.setActiveTab(id)}} //change the parent's state of page 
					/>}
			</View>
    );
  }
}
function mapStateToProps(state) {
  return {
		loggedin: state.Auth.loggedin,
		pincode:state.Auth.pincode,
		user_id:state.Auth.user_id,
		start_screen_flag:state.Auth.start_screen_flag,
		menustatus:state.Auth.menustatus
	};
}
export default connect(mapStateToProps, { })(MainApp);
