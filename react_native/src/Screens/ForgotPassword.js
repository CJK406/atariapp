import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Toast from 'react-native-simple-toast';
import { requestResetPassword as requestResetPasswordApi } from '../Api';

class ForgotPasswordScreen extends React.Component {
	state = {
		email: ''
	}

	goNext = async () => {
		const { email } = this.state;
		if (email.length === 0) {
			Toast.show('Please fill in all fields.');
			return;
		}
		if (!email.toLowerCase().match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)) {
			Toast.show('Invalid Email Format');
			return;
		}

		try {
			const response = await requestResetPasswordApi(email);
			if (response && response.data) {
				Toast.show('Please check your email inbox.');
				this.props.navigation.navigate('ResetPassword', { email });
			} else {
				let errors = response.errors || [];
				let messages = [];
				for (var i=0; i< errors.length; i++) {
					messages.push(errors[i].message)
				}
				if (messages.length === 0) {
					messages.push('Unknown error')
				}
				Toast.show(messages[0]);
			}
		} catch (err) {
			Toast.show('An error occured. Please try again later');
		}
	}

	goBack = () => {
		this.props.navigation.navigate('Login');
	}

  render() {
		const { primaryColor, secondaryColor, thirdcolor, forthColor } = this.props.theme.palette;
		const { email } = this.state;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)' }}>
				<View style={[CustomStyles.container, CustomStyles.innerContainer]}>
				
					<Image source={Images.Forget_icon} style={{marginLeft:'35%'}} />
					<Text style={{fontSize: 45, lineHeight: 55, textAlign:'center', fontWeight: 'bold', color: 'white', marginBottom: 35}}>Forget Password</Text>
					<Text style={{...styles.customWriting}}>We just need your registered email to send you password reset instructions</Text>
					<View style={{justifyContent: 'center', alignItems: 'center'}}>
						<TextInput
							style={{...CustomStyles.textInput, marginBottom: 20}}
							onChangeText={text => this.setState({email: text})}
							value={email}
							autoCompleteType="email"
							keyboardType="email-address"
							placeholder="Email"
							placeholderTextColor={forthColor}
							/>
						<TouchableOpacity onPress={() => this.goNext()} style={{backgroundColor:'rgb(227,30,45)',width:'100%', padding:20,borderRadius:10,textAlign:'center',justifyContent:'center',shadowColor: '#000',
    						shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.8, shadowRadius: 2}}>
							<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>SEND EMAIL</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.goBack()} style={{marginTop: 20, borderRadius:10, ...CustomStyles.buttonStyle, ...CustomStyles.smallBtn, ...CustomStyles.longBtn, backgroundColor: thirdcolor}}>
							<Text style={{fontSize: 18, color: 'white'}}>BACK TO LOGIN</Text>
						</TouchableOpacity>

						
					</View>
					
				</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
	customWriting: {
		fontSize: 18,
		color: '#7882A2',
		marginBottom: 18,
		textAlign:'center',
		marginBottom:40
	}
});

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {})(withTheme(ForgotPasswordScreen));
