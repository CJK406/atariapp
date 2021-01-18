import * as React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator,Text, Image, TouchableOpacity, View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Icon from 'react-native-vector-icons/Ionicons';
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
import Modal from 'react-native-modal';
import { $CombinedState } from 'redux';

class SignupScreen extends React.Component {
	state = {
		email: '',
		password: '',
		fullname:'',
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
			if (response && response.data) {
				if (response.errors && response.errors.length > 0) {
					Toast.show(response.errors[0].message);
				} else {
					this.props.authSetUserInfo(response.data);
				}
			} else {
				let errors = response.errors || [];
				let messages = [];
				for (var i=0; i< errors.length; i++) {
					messages.push(errors[i].message)
				}
				if (messages.length === 0) {
					//messages.push('Unknown error')
				}
				Toast.show('Email or Password is incorrect');
			}
		} catch (err) {
			Toast.show('An error occured. Please try again later');
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (state.loading && !props.loading) {
			let errorMsg = (props.messages && props.messages[0]) || '';
			if (errorMsg.length > 0) {
				Toast.show(errorMsg);
			}
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
		const { email, password,fullname } = this.state;
		const parsedIcon = parseIconFromClassName('fa fa-envelope');
    return (
      <SafeAreaView style={{backgroundColor: primaryColor }}>
			<View style={styles.containerlogin100}>
				<View style={{backgroundColor:'black'}}>
					<View style={{width:150, marginLeft:'20%',marginTop:40}}>
						<Image source={Images.Logo} style={{justifyContent:'center'}} />
					</View>
					<View style={{height: '80%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center'}}>
						<View style={{padding:30, backgroundColor:'white', borderRadius:20, width:'85%'}}>
							<Text style={{fontSize:20,color:'rgb(233, 47, 47)',textAlign:'center',fontWeight:'bold', marginBottom:30}}>
								Sign Up
							</Text>
							<View style={{flex:1,flexDirection:'row',marginBottom:60}}>
								<View style={{marginRight:10}}>
									<Icon name="card" style={{marginTop:13}} size={25} color="black" />
								</View>
								<View style={{width:'95%'}}>
									<TextInput
										style={styles.textInput}
										onChangeText={text => this.setState({fullname: text})}
										className="input100 fullname"
										value={fullname}
										placeholder="Full name"
										placeholderTextColor="black"
										/>
								</View>
							</View>
							<View style={{flex:1,flexDirection:'row',marginBottom:60}}>
								<View style={{marginRight:10}}>
									<Icon name="mail" style={{marginTop:13}} size={25} color="black" />
								</View>
								<View style={{width:'95%'}}>
									<TextInput
										style={styles.textInput}
										onChangeText={text => this.setState({email: text})}
										className="input100 username"
										value={email}
										autoCompleteType="email"
										keyboardType="email-address"
										placeholder="Email"
										placeholderTextColor="black"
										
										/>
								</View>
							</View>
							<View style={{flex:1, flexDirection:'row', marginBottom:90}}>
								<View style={{marginRight:10}}>
									<Icon name="lock-closed" size={25} color="black" style={{marginTop:13}} />
								</View>
								<View style={{width:'95%'}}>
									<TextInput
										style={styles.textInput}
										onChangeText={text => this.setState({password: text})}
										value={password}
										secureTextEntry={true}
										placeholder="Password"
										placeholderTextColor="black"
										
										/>
									<Text class="focus-input100" style="font-family: Consolas;" data-placeholder="Password"></Text>
								</View>
							</View>
							
							<View class="container-login100-form-btn m-t-40">
								<TouchableOpacity className="login100-form-btn" onPress={() => this.doLogin()} 
									style={{backgroundColor:'rgb(227,30,45)', padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
								>
									{this.state.loading ? (
										<ActivityIndicator size="large" color="white" />
										)
									:
									(
										<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>SIGN UP</Text>
									)
									}
								</TouchableOpacity>
								
							</View>
							<View style={{flexDirection: 'row', marginTop: 'auto',justifyContent:'center',marginTop:20}}>
								<Text style={{color: 'black', fontSize: 16, marginRight: 5}}>Already have an account?</Text>
								<TouchableOpacity onPress={() => this.goNext('Login')}>
									<Text style={{color: 'red', fontSize: 16, textDecorationLine: 'underline', fontWeight: 'bold', textDecorationStyle: 'solid', textDecorationColor: '#97DC21'}}>Log In</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				
			</View>
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
});
function mapStateToProps(state) {
  return {
  };
}
export default connect(mapStateToProps, { authSetUserInfo,authSetToken })(withTheme(SignupScreen));
