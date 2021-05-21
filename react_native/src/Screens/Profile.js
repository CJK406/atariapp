import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, ScrollView, Linking ,Switch} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header, SettingMenu } from '../Components';
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
	constructor(props) {
		super(props)

	}
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
	

	goToDetail = (item) => {
		this.props.navigation.navigate(item);
	}
	logout = () => {
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
		let me = this.props.me || {};

		const themeBG =  themeToggle? 'rgb(33,33,33)':'white'
		const txtColor = themeToggle?'white':'black'
    return (
      <SafeAreaView style={{backgroundColor:themeBG,...CustomStyles.container}}>
				<View style={[CustomStyles.container, styles.innerContainer]}>
					<Header darkmode={themeToggle} />
					<ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, paddingHorizontal:30, paddingTop:30}} contentContainerStyle={{paddingBottom: 15}}>
						<Text style={{fontSize:15,marginBottom:14, color:txtColor}}>General</Text>
						
						<SettingMenu icon={Menus[1].icon} title={Menus[1].name}
							subTitle={Menus[1].description}
							withAction
							actionValue={notificationToggle}
							onAction={(key) => this.changeNotificationSetting(key)}
						/>
						
						<Text style={{fontSize:15,marginBottom:14,color:txtColor}}>Advanced</Text>
						<SettingMenu icon={Menus[3].icon} title={Menus[3].name}
							subTitle={Menus[3].description}
							withAction
							actionValue={this.state.themeToggle}
							onAction={(key) => this.changeTheme(key)}
						/>
						<SettingMenu icon={Menus[4].icon} title={Menus[4].name}
							onPress={() => Linking.openURL('mailto:token@atari.com')}
						/>
						<SettingMenu icon={Menus[5].icon} title={Menus[5].name}
							onPress={() => this.goToDetail('ResetPin')}
						/>
						<SettingMenu icon={Menus[6].icon} title={Menus[6].name}
							onPress={this.logout}
						/>
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
