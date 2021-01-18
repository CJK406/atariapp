import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, ScrollView, Alert ,Switch} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogoBox } from '../Components';
import Logo from '../Assets/logo.png';
import { settingTheme,authLogout,settingNotification } from '../Redux/Actions';

const Menus = [
	{ name: 'Currency', page: '', icon: 'logo-usd', description:'Set your preferred local currency'},
	{ name: 'Notifications', page: 'Notifications', icon: 'notifications-outline',description:'Allow notifications for fund updates' },
	{ name: 'Language', page: '', icon: 'language-outline',description:'Change app language' },
	{ name: 'Theme', page: '', icon: 'contrast-outline',description:'Select between dark and light theme' },
	{ name: 'Support', page: '', icon: 'help-buoy-outline',description:'' },
	{ name: 'Reset Pincode', page: 'ResetPin', icon: 'refresh-outline',description:'' },
	{ name: 'Logout', page: '', icon: 'log-out-outline',description:'' },
];
class ProfileScreen extends React.Component {
	state = {
		themeToggle:true,
		notificationToggle:true,
	}
	static getDerivedStateFromProps(props, state) {
		return {
			themeToggle:props.darkmode,
			notificationToggle:props.notification_Flag,
		};
	  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	goToDetail = (item) => {
		this.props.navigation.navigate(item);
	}
	logout = () => {
		this.props.navigation.navigate('Login');
		this.props.authLogout();

	}
	navigate = (pagename) => {
		this.props.navigation.navigate(pagename);
	}
	checkUnread = () => {
		let index = this.props.notifications.findIndex(temp => temp.read === 0);
		return index > -1;
	}
	changeTheme = (key) => {
		this.setState({themeToggle:key})
		this.props.settingTheme(key);
	}

	changeNotificationSetting = (key) => {
		this.setState({notificationToggle:key})
		this.props.settingNotification(key);
	}

  render() {
	  const {themeToggle,notificationToggle} = this.state;
	  console.log("notificationToggle",notificationToggle);
		let me = this.props.me || {};
    return (
      <SafeAreaView style={[themeToggle ? {backgroundColor: 'rgb(33,33,33)'} : {backgroundColor: 'white'},{...CustomStyles.container}]}>
				<View style={[CustomStyles.container, styles.innerContainer]}>
					<View style={[themeToggle ? {backgroundColor:'black'} : {backgroundColor:'white'},{height: 70, alignItems: 'center', justifyContent: 'center', position: 'relative', width:'100%'}]}>
						<LogoBox style={{position: 'absolute', left: 0}}/>
						<Image source={Logo} style={{width:160, height:50}} />
					</View>
					<ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, margin:30}} contentContainerStyle={{paddingBottom: 15}}>
						<Text style={[themeToggle ? {color:'white'}:{color:'black'},{fontSize:15,marginBottom:14}]}>General</Text>
						<TouchableOpacity  style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<View style={{width:'10%'}}><Ionicons name={Menus[0].icon} size={26} color="white" /></View>
								<View style={{width:'75%'}}>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[0].name}</Text>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 10,color:'#a7a7a7'}}>{Menus[0].description}</Text>
								</View>
								<View style={{width:'15%'}}> 
									<View style={{backgroundColor:'#545454',padding:5,borderRadius:5}}><Text style={{textAlign:'center',justifyContent:'center',color:'white',fontSize:10}}>USD</Text></View>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<View style={{width:'10%'}}>
									<Ionicons name={Menus[1].icon} size={26} color="white" />
								</View>
								<View style={{width:'75%'}}>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[1].name}</Text>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 10,color:'#a7a7a7'}}>{Menus[1].description}</Text>
								</View>
								<View style={{width:'15%'}}>
								<Switch
									trackColor={{ false: "#767577", true: "red" }}
									thumbColor="white"
									ios_backgroundColor="#3e3e3e"
									onValueChange={(key) => this.changeNotificationSetting(key)}
									value={notificationToggle}
								/>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity  style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<View style={{width:'10%'}}>
									<Ionicons name={Menus[2].icon} size={26} color="white" />

								</View>
								<View style={{width:'75%'}}>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[2].name}</Text>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 10,color:'#a7a7a7'}}>{Menus[0].description}</Text>
								</View>
								<View style={{width:'15%',paddingLeft:'4%'}}>
									<Ionicons name="chevron-forward-outline" size={26} color="white" />
								</View>
							</View>
						</TouchableOpacity>
						<Text style={[themeToggle ? {color:'white'}:{color:'black'},{fontSize:15,marginBottom:14}]}>Advanced</Text>
						<TouchableOpacity  style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<View style={{width:'10%'}}>
									<Ionicons name={Menus[3].icon} size={26} color="white" />
								</View>
								<View style={{width:'75%'}}>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[3].name}</Text>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 10,color:'#a7a7a7'}}>{Menus[3].description}</Text>
								</View>
								<View style={{width:'15%',paddingLeft:'2%'}}>
								<Switch
									trackColor={{ false: "#767577", true: "red" }}
									thumbColor="white"
									ios_backgroundColor="#3e3e3e"
									 onValueChange={(key) =>this.changeTheme(key)}
									value={this.state.themeToggle}
								/>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<Ionicons name={Menus[4].icon} size={26} color="white" />
								<View>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[4].name}</Text>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.goToDetail('ResetPin')} style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<Ionicons name={Menus[5].icon} size={26} color="white" />
								<View>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[5].name}</Text>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.logout()}  style={{backgroundColor: 'rgb(66,66,66)', marginBottom: 25, padding:25,borderRadius:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
								<Ionicons name={Menus[6].icon} size={26} color="white" />
								<View>
									<Text style={{color: 'white', marginLeft: 10, fontSize: 15}}>{Menus[6].name}</Text>
								</View>
							</View>
						</TouchableOpacity>
					</ScrollView>
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
	},
	darkModeBackground:{
		backgroundColor:'black',
	},
	whiteModeBackground:{
		backgroundColor:'white',
	}
});

function mapStateToProps(state) {
  return {
	darkmode:state.Auth.darkmode,
	notification_Flag:state.Auth.notification_Flag,
  };
}

export default connect(mapStateToProps, {settingTheme,authLogout,settingNotification})(withTheme(ProfileScreen));
