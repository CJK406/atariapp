import * as React from 'react';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import Video from "react-native-video";
import Base64 from '../Utils/Base64';
import FontAwesome, {
	SolidIcons,
	RegularIcons,
	BrandIcons,
	parseIconFromClassName,
  } from 'react-native-fontawesome';
import Toast from 'react-native-simple-toast';
import { authSetUserInfo,authSetToken } from '../Redux/Actions';
import { login as loginApi} from '../Api';

const { width, height } = Dimensions.get("window");
class LoginScreen extends React.Component {
	state = {
		email: '',
		password: '',
		show_modal:false,
		loading:false,
	}
	componentDidMount() {
	}

	doLogin = async () => {
		const { email, password } = this.state;
		if (email.length === 0 || password.length === 0) {
			Toast.show('Please fill in all fields.');
			return;
		}
		if (!email.toLowerCase().match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)) {
			Toast.show('Invalid Email Format');
			return;
		}
		try {
			this.setState({loading:true});
			await this.props.authSetToken(Base64.btoa(email + ':' + password));
			const response = await loginApi();
			this.setState({loading:false});
			if (response && response.data && response.error===null) {
					this.props.authSetUserInfo(response.data);
			} else {
				Toast.show('Email or Password is incorrect');
			}
		} catch (err) {
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (state.loading && !props.loading) {
			let errorMsg = (props.messages && props.messages[0]) || '';
			if (errorMsg.length > 0) {
				Toast.show(errorMsg);
			}
		}
		if(props.route.params===undefined){
			this.props.navigation.navigate('Start');
		}
		return {
			isLoggedin: props.isLoggedin,
		}
  	}
	goNext = (page) => {
		this.props.navigation.navigate(page);
	}
	toggleModal = () => {
		this.setState({
			show_modal:!this.state.show_modal
		})
	}

  	render() {
		const { primaryColor, secondaryColor, thirdcolor, forthColor, fifthColor } = this.props.theme.palette;
		const { email, password } = this.state;
		const parsedIcon = parseIconFromClassName('fa fa-envelope');
    return (
      <SafeAreaView style={{backgroundColor: primaryColor }}>
			<Video
				source={Images.start_video}
				style={styles.backgroundVideo}
				resizeMode={"cover"}
				onEnd={console.log('123')}
				/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
	customWriting: {
		fontSize: 12,
		color: '#7882A2'
	},
	containerlogin100:{
		width: '100%',
    	minHeight: '100%',
	    padding: 15,
		backgroundColor: 'black',
		justifyContent:'center'
	},
	textInput: {
		height: 44,
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
		width: '100%',
		backgroundColor: 'white',
		paddingLeft: 16,
		color: 'black',
		fontSize: 12,
		fontWeight:'800'
	},
	iconStyle: {
		fontSize: 40,
		color: 'black',
	},
	backgroundVideo:{
		height: height,
		position: "absolute",
		top: 0,
		left: 0,
		alignItems: "stretch",
		bottom: 0,
		right: 0
	}
});
function mapStateToProps(state) {
  return {
  };
}
export default connect(mapStateToProps, { authSetUserInfo,authSetToken })(withTheme(LoginScreen));
