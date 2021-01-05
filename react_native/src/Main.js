/**
 * @format
 */

import React from 'react';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import {
	StartScreen,
	LoginScreen, ForgotPasswordScreen, 	TradeScreen, DashboardScreen, 
	ProfileScreen,NotificationScreen, ExchangeScreen,SendConfirmScreen,QRScanScreen,SendPaymentScreen } from './Screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { initFirebase } from './Utils/Firebase';
import { updateNotifcationToken as updateNotifcationTokenApi } from './Api';
import notifee from '@notifee/react-native';
import { getChats, getNotifications } from './Redux/Actions';

const AuthStack = createStackNavigator();
const AuthStackScreens = () => (
	<AuthStack.Navigator screenOptions={{ headerShown: false }}>
		<AuthStack.Screen name="Start" component={StartScreen} />
		<AuthStack.Screen name="Login" component={LoginScreen} />
		<AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
	</AuthStack.Navigator>
);

const MainTab = createBottomTabNavigator();
const TabBarOptions = {
	showIcon: true,
	activeTintColor: '#97DC21',
	inactiveTintColor: 'white',
	style: {
		backgroundColor: '#2D333B',
		borderTopColor: '#707070'
	},
	keyboardHidesTabBar: true
};
const TabScreenOptions = (route) => ({
	tabBarIcon: ({ focused, color, size }) => {
		let iconName;

		if (route.name === 'Dashboard') {
			iconName = 'reader-outline';
		} else if (route.name === 'Trade') {
			iconName = 'pulse-outline';
		} else if (route.name === 'QRScan') {
			iconName = 'qr-code-outline';
		} else if (route.name === 'Exchange') {
			iconName = 'swap-horizontal-outline';
		} else if (route.name === 'Setting') {
			iconName = 'settings-outline';
		}
		return <Ionicons name={iconName} size={size} color={color} />;
	}
});

const getTabBarVisibility = (route) => {
	const routeName = route.state
		? route.state.routes[route.state.index].name
		: '';
	const TabRoutes = ['Dashboard', 'Trade', 'QRScan', 'Exchange', 'Setting'];
	if (routeName.length > 0 && TabRoutes.indexOf(routeName) === -1) {
		return false;
	}

	return true;
};

const TradeStack = createStackNavigator();
const TradeScreens = () => (
	<TradeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Trade">
		<TradeStack.Screen name="Trade" component={TradeScreen} />
		<TradeStack.Screen name="SendConfirm" component={SendConfirmScreen} />
	</TradeStack.Navigator>
);

const DashboardStack = createStackNavigator();
const DashboardScreens = () => (
	<DashboardStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Dashboard">
		<DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
	</DashboardStack.Navigator>
);
const ExchangeStack = createStackNavigator();
const ExchangeScreens = () => (
	<ExchangeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Exchange">
		<ExchangeStack.Screen name="Exchange" component={ExchangeScreen} />
	</ExchangeStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileScreens = () => (
	<ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Setting">
		<ProfileStack.Screen name="Setting" component={ProfileScreen} />
		<ProfileStack.Screen name="Notifications" component={NotificationScreen} />
	</ProfileStack.Navigator>
);

const QrScanStack = createStackNavigator();
const QrScanScreens = () => (
	<QrScanStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="QRScan">
		<QrScanStack.Screen name="QRScan" component={QRScanScreen} />
		<QrScanStack.Screen name="SendPayment" component={SendPaymentScreen} />
		<QrScanStack.Screen name="SendConfirm" component={SendConfirmScreen} />
	</QrScanStack.Navigator>
);


const MainTabScreens = () => (
	<MainTab.Navigator tabBarOptions={TabBarOptions} screenOptions={({ route }) => TabScreenOptions(route)}>
		<MainTab.Screen name="Dashboard" component={DashboardScreens} options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route) })}/>
		<MainTab.Screen name="Trade" component={TradeScreens} options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route) })} />
		<MainTab.Screen name="QRScan" component={TradeScreens} options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route) })} />
		<MainTab.Screen name="Exchange" component={ExchangeScreens} options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route) })} />
		<MainTab.Screen name="Setting" component={ProfileScreens} options={({ route }) => ({ tabBarVisible: getTabBarVisibility(route) })} />
	</MainTab.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreens = (info) => (
	<RootStack.Navigator screenOptions={{ headerShown: false }}>
		{info.loggedin
			?	<RootStack.Screen name="App" component={MainTabScreens} />
			: <RootStack.Screen name="Auth" component={AuthStackScreens} />
		}
	</RootStack.Navigator>
);

const uiTheme = {
	palette: {
		primaryColor: '#262C34',
		secondaryColor: '#97DC21',
		thirdcolor: '#3C599B',
		forthColor: '#7882A2',
		fifthColor: '#E3411F',
		sixthColor: '#878A91',
		secondBg: '#23262C'
	}
};

let unsubscriber = null;
let messageUnsubscriber = null;

class MainApp extends React.Component {
	constructor(props) {
		super(props);
		this.navigationRef = React.createRef();
	}

	async componentDidMount() {
		if (this.props.loggedin) {
			await initFirebase();
			this.initFireStore();
			this.initNotification();
		}
	}

	async componentDidUpdate(prevProps) {
		if (!prevProps.loggedin && this.props.loggedin) {
			await initFirebase();

			this.initFireStore();
			this.initNotification();
		}
	}

	initFireStore = async () => {
		if (unsubscriber) unsubscriber(); 
		unsubscriber = firestore().collection('rooms')
				.where('user_ids', 'array-contains', this.props.me.id)
				.orderBy('createdAt', 'desc')
				.onSnapshot((data) => {
					if (data.docs) {
						let updates = [];
						for (let item of data.docs) {
							updates.push({
								id: item.id,
								...item.data()
							})
						}
						this.props.getChats(updates);
					}
				}, (err) => {
					console.log("FIRESTORE FETCH ERR", err)
				});
	}

	initNotification = async () => {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;
		if (!enabled) return;
		
		const fcmToken = await messaging().getToken();
		if (fcmToken && fcmToken.length > 0) {
			await updateNotifcationTokenApi(fcmToken)
		}
		if (messageUnsubscriber) messageUnsubscriber();
		messageUnsubscriber = messaging().onMessage(async remoteMessage => {
			await notifee.deleteChannel('default');
			this.props.getNotifications();
			const channelId = await notifee.createChannel({
				id: 'default',
				name: 'Default Channel',
			});
			const { title, body } = remoteMessage.notification;
			await notifee.displayNotification({
				title, body, 
				android: {
					channelId,
				},
			});
		});

		messaging().onNotificationOpenedApp(remoteMessage => {
			this.navigationRef.current?.navigate("Profile");
    });

		messaging().setBackgroundMessageHandler(async remoteMessage => {
			this.props.getNotifications();
			console.log('Message handled in the background!', remoteMessage);
		});
	}

	componentWillUnmount() {
		if (unsubscriber) unsubscriber(); 
		if (messageUnsubscriber) messageUnsubscriber();
	}

  render() {
		const { loggedin } = this.props;
    return (
			<ThemeContext.Provider value={getTheme(uiTheme)}>
				<NavigationContainer ref={this.navigationRef}>
					<RootStackScreens loggedin={loggedin} />
				</NavigationContainer>
			</ThemeContext.Provider>
    );
  }
}

function mapStateToProps(state) {
  return {
		loggedin: state.Auth.loggedin,
		me: state.Auth.me
  };
}

export default connect(mapStateToProps, { getChats, getNotifications })(MainApp);
