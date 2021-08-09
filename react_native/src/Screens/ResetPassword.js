import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, TextInput,ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Toast from 'react-native-simple-toast';
import { resetPassword  } from '../Api';
import { update_verifyToken } from '../Redux/Actions';

class ResetPasswordScreen extends React.Component {
	state = {
		password: '',
		c_password : '',
        button_loading:false,
        verify_token:''
	}

    static getDerivedStateFromProps(props, state) {
		return {
			verify_token:props.verify_token
		};
	  }
  render() {
		const { thirdcolor} = this.props.theme.palette;
		const { password,c_password,button_loading} = this.state;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)' }}>
		<View style={[CustomStyles.container, CustomStyles.innerContainer]}>

			<Image source={Images.Forget_icon} style={{marginLeft:'35%'}} />
			<Text style={{fontSize: 45, lineHeight: 55, textAlign:'center', fontWeight: 'bold', color: 'white', marginBottom: 35}}>Reset Password</Text>
			<Text style={{...styles.customWriting}}>Please Input Password</Text>
			<View style={{justifyContent: 'center', alignItems: 'center'}}>
				<TextInput value={password}
					style={{...CustomStyles.textInput, marginBottom: 20,color:'white'}}
					onChangeText={text => this.setState({password: text})}
                    secureTextEntry={true}
					placeholder="Type your password"
					placeholderTextColor="rgba(255,255,255,0.3)"
					/>

                <TextInput value={c_password}
					style={{...CustomStyles.textInput, marginBottom: 20,color:'white'}}
					onChangeText={text => this.setState({c_password: text})}
                    secureTextEntry={true}
					placeholder="Retype your password"

					placeholderTextColor="rgba(255,255,255,0.3)"
					/>
				<TouchableOpacity onPress={this.goNext} style={{backgroundColor:'rgb(227,30,45)',width:'100%', padding:20,borderRadius:10,textAlign:'center',justifyContent:'center',shadowColor: '#000',
					shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.8, shadowRadius: 2}}>
					{this.state.button_loading
                        ?<ActivityIndicator size="large" color="white" />
                        :<Text style={{fontWeight: 'bold', fontSize: 18,color:"white",textAlign:'center'}}>Change Password</Text>}

					{/* <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>SEND EMAIL</Text> */}
				</TouchableOpacity>
				<TouchableOpacity onPress={this.goBack} style={{marginTop: 20, borderRadius:10, ...CustomStyles.buttonStyle, ...CustomStyles.smallBtn, ...CustomStyles.longBtn, backgroundColor: thirdcolor}}>
					<Text style={{fontSize: 18, color: 'white'}}>BACK TO LOGIN</Text>
				</TouchableOpacity>
			</View>
		</View>
      </SafeAreaView>
    );
  }
  goNext = async () => {
	const { c_password, password, verify_token } = this.state;
	if (c_password.length === 0 || password.length===0 || c_password!==password) {
		Toast.show('Confirm password is not match. Please check again');
		return;
	}
	
	try {
		let data = {newPass:password,token:verify_token};
		this.setState({button_loading:true})
		const response = await resetPassword(data);
        if (response.code===200) {
			Toast.show("Your password has been changed.");
		    this.props.navigation.navigate('Login');
		} else {
			Toast.show(response.message);
		}
		this.setState({button_loading:false})

	} catch (err) {}
	}
	goBack = () => {
		this.props.navigation.navigate('Login');
	}
}
const styles = StyleSheet.create({
	customWriting: {
		fontSize: 18,
		color: '#7882A2',
		textAlign:'center',
		marginBottom:40
	}
});
function mapStateToProps(state) {
	return {
        verify_token:state.Auth.verify_token,

	};
  }
export default connect(mapStateToProps, {update_verifyToken})(withTheme(ResetPasswordScreen));
