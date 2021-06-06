import React from 'react';
import { View} from 'react-native';

import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Pusher from 'pusher-js/react-native';
import Toast from 'react-native-simple-toast';
import { withTheme } from 'react-native-material-ui';
import Router from './Router'
// import {initFirebase} from "./Utils/Firebase";

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
	}

	state = {
		menuDelay:false,
		user_id:"",
		loggedin:false,
		pincode:"",
		start_screen_flag:false,
		menustatus:false,
		showSplash:true,
	}

	static getDerivedStateFromProps(props, state) {
		return {
			user_id:props.user_id,
			loggedin:props.loggedin,
			pincode:props.pincode,
			start_screen_flag:props.start_screen_flag,
			menustatus:props.menustatus,
			darkmode:props.darkmode
		};
	}

	componentDidMount(): void {
		// initFirebase()
	}

	render() {
		const { loggedin } = this.state;
		if(loggedin){ this.setNotification(); }

		return (
			<View style={{flex:1, flexDirection:'column'}}>
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

  	setNotification(){
		const {user_id} = this.state;
		let pusher = new Pusher(PusherConfig.key, PusherConfig);
		let chatChannel = pusher.subscribe('payment-received-'+user_id);
		chatChannel.bind('payment-received-'+user_id, (data) => { // (4)
			Toast.show(data);
		});
	}


}

function mapStateToProps(state) {
  return {
		loggedin: state.Auth.loggedin,
		pincode:state.Auth.pincode,
		user_id:state.Auth.user_id,
		start_screen_flag:state.Auth.start_screen_flag,
		menustatus:state.Auth.menustatus,
		darkmode:state.Auth.darkmode
	};
}
export default connect(mapStateToProps, { })(withTheme(MainApp));
