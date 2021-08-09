import React from 'react';
import { View} from 'react-native';

import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Pusher from 'pusher-js/react-native';
import Toast from 'react-native-simple-toast';
import { withTheme } from 'react-native-material-ui';
import Router from './Router'
import { updateBallance,setAllHistory} from './Redux/Actions';
import {AwesomeAlert} from './Components'
import { receiveActionApi,sendActionApi } from './Api';
import DeviceInfo from 'react-native-device-info';

let ip_address="";
DeviceInfo.getIpAddress().then((ip) => {
	ip_address= ip;
});
const PusherConfig = {
	appId:"1214653",
	key:"95de4f5c8de5ab46b667",
	secret:"8b9243e378801d4231c3",
	cluster:"eu",
}
let unsubscriber = null;
let messageUnsubscriber = null;


class MainApp extends React.Component {
	constructor(props) {
		super(props);
        this.awesomeAlert = null

	} 

	state = {
		menuDelay:false,
		user_id:"",
		loggedin:false,
		pincode:"",
		start_screen_flag:false,
		menustatus:false,
		showSplash:true,
		notification_Flag:true,
		setNotiFlag:false
	}
	

	static getDerivedStateFromProps(props, state) {
		return {
			user_id:props.user_id,
			loggedin:props.loggedin,
			pincode:props.pincode,
			start_screen_flag:props.start_screen_flag,
			menustatus:props.menustatus,
			darkmode:props.darkmode,
			notification_Flag:props.notification_Flag,
			email:props.email,
			name:props.name
		};
	}
	setNotification(){
		const {user_id,notification_Flag} = this.state;
		let pusher = new Pusher(PusherConfig.key, PusherConfig);
		let chatChannel = pusher.subscribe('transaction');
		chatChannel.bind('receive_token-'+user_id, (data) => { // (4)
				console.log("receive_pusher-------=--==--=-",data);
				this.props.updateBallance();
				this.props.setAllHistory();
				const formData = new FormData();
				formData.append('name', this.state.name);
				formData.append('email', this.state.email);
				formData.append('id', this.state.user_id);
				formData.append('from_address', data.data.fromAddress);
				formData.append('to_address', data.data.toAddress);
				formData.append('currency', data.data.asset);
				formData.append('amount', data.data.value);
				formData.append('status', "Complete");
				formData.append('message', "");
				formData.append('ipaddress',ip_address);
				console.log("ffff",formData);
				receiveActionApi(formData);
				this.awesomeAlert.showAlert('success', "Congratulations", "You have successfully received "+data.data.value+" "+data.data.asset);
		});
		chatChannel.bind('send_token-'+user_id, (data) => { // (4)
				console.log("send_token-------=--==--=-",data);

				let status="";
				let message ="";
				let send_status = data.data.status;
					if(send_status==="Success"){
						if(notification_Flag)
						{
							this.awesomeAlert.showAlert('success', "Congratulations", "Transaction successfully sent");
							this.props.updateBallance();
							this.props.setAllHistory();
						}
						status="Complete";
					}
					else if(send_status==="Pending")
						this.props.setAllHistory();
					else{
						if(notification_Flag)
							this.awesomeAlert.showAlert('error', "Failed!", "Your transaction was not successful");
						status="Failed";
						message = "Transaction was not successful";
					}
					
					if(send_status!=="Pending"){
						const formData = new FormData();
						formData.append('name', this.state.name);
						formData.append('email', this.state.email);
						formData.append('id', this.state.user_id);
						formData.append('address', data.data.toAddress);
						formData.append('currency',  data.data.asset);
						formData.append('amount', data.data.value);
						formData.append('status', status);
						formData.append('message', message);
						formData.append('ipaddress',ip_address);
						sendActionApi(formData);
					}
		});
		this.setState({
			setNotiFlag:true
		});
	}

	render() {
		const { loggedin,setNotiFlag } = this.state;
		if(loggedin && !setNotiFlag){ this.setNotification(); }

		return (
			<View style={{flex:1, flexDirection:'column'}}>
        		<AwesomeAlert ref={(ref) => this.awesomeAlert = ref }/> 
				<View style={{flex:1}}>
					
					<Router/>
				</View>
			</View>
		)
	}

	componentWillUnmount() {
		if (unsubscriber) unsubscriber();
		if (messageUnsubscriber) messageUnsubscriber();
	}
  
}

function mapStateToProps(state) {
  return {
		loggedin: state.Auth.loggedin,
		pincode:state.Auth.pincode,
		user_id:state.Auth.user_id,
		start_screen_flag:state.Auth.start_screen_flag,
		menustatus:state.Auth.menustatus,
		darkmode:state.Auth.darkmode,
		notification_Flag:state.Auth.notification_Flag,
		name:state.Auth.user_name,
        email:state.Auth.email,
	};
}
export default connect(mapStateToProps, {updateBallance,setAllHistory })(withTheme(MainApp));
