import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, TextInput,ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Toast from 'react-native-simple-toast';
import { forgetPassword  } from '../Api';
import { update_verifyToken } from '../Redux/Actions';

class VerifyCodeScreen extends React.Component {
	state = {
		insert_verify_code: '',
		verify_code:'',
		verify_token:'',
		button_loading : false
	}
	shouldComponentUpdate(nextProps, nextState) {
        return this.state.insert_verify_code != nextState.insert_verify_code || 
		this.state.button_loading != nextState.button_loading
    }
	static getDerivedStateFromProps(props, state) {
		return {
			verify_code:props.verify_code,
			verify_token:props.verify_token
		};
	  }
  render() {
		const { thirdcolor} = this.props.theme.palette;
		const { insert_verify_code, verify_code, button_loading} = this.state;

    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)' }}>
		<View style={[CustomStyles.container, CustomStyles.innerContainer]}>

			<Image source={Images.Forget_icon} style={{marginLeft:'35%'}} />
			<Text style={{fontSize: 45, lineHeight: 55, textAlign:'center', fontWeight: 'bold', color: 'white', marginBottom: 35}}>Verify Code</Text>
			<Text style={{...styles.customWriting}}>Please enter the verification code sent to your email.</Text>
			<View style={{justifyContent: 'center', alignItems: 'center'}}>
				<TextInput value={insert_verify_code}
					style={{...CustomStyles.textInput, marginBottom: 20,color:'white'}}
					onChangeText={text => this.setState({insert_verify_code: text})}
					placeholder="Verify Code"
					placeholderTextColor="rgba(255,255,255,0.3)"

					/>
				<TouchableOpacity onPress={this.goNext} style={{backgroundColor:'rgb(227,30,45)',width:'100%', padding:20,borderRadius:10,textAlign:'center',justifyContent:'center',shadowColor: '#000',
					shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.8, shadowRadius: 2}}>
					{this.state.button_loading
                        ?<ActivityIndicator size="large" color="white" />
                        :<Text style={{fontWeight: 'bold', fontSize: 18,color:"white",textAlign:'center'}}>NEXT</Text>}

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
	const { verify_code, insert_verify_code, verify_token } = this.state;
	if (insert_verify_code.length === 0) {
		Toast.show('Please fill in fields.');
		return;
	}
	if (verify_code!==insert_verify_code) {
		Toast.show('The verify code is not correct. Please check again');
		return;
	}
	try {
		this.props.navigation.navigate('ResetPassword');
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
        verify_code:state.Auth.verify_code,
        verify_token:state.Auth.verify_token,
		
	};
  }
export default connect(mapStateToProps, {update_verifyToken})(withTheme(VerifyCodeScreen));
