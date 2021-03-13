import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Easing,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import Toast from 'react-native-simple-toast';
import { authSetUserInfo,authSetToken,updateStartScreenState } from '../Redux/Actions';
import { login as loginApi, signup as signupApi} from '../Api';

import Base64 from '../Utils/Base64';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HEADER_MAX_HEIGHT = windowHeight * 0.6;
const HEADER_MIN_HEIGHT = windowHeight * 0.06;

class LoginScreen extends React.Component {
    state={
      scrollY: new Animated.Value(0),
      login_email: '',
      login_password:'',
      signup_email:'',
      signup_password:'',
      signup_name:'',
      signup_c_password:'',
      login_loading:false,
		  signup_loading:false,
      

    }
	goNext = (location) => {
		this.props.navigation.navigate(location);
	}
	componentDidMount() {
	
  }
  
  doLogin = async () => {
		const { login_email, login_password } = this.state;
		if (login_email.length === 0 || login_password.length === 0) {
			Toast.show('Please fill in all fields.');
			return;
		}
		if (!login_email.toLowerCase().match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)) {
			Toast.show('Invalid Email Format');
			return;
		}
		try {
			this.setState({login_loading:true});
			await this.props.authSetToken(Base64.btoa(login_email + ':' + login_password));
      const response = await loginApi();
			this.setState({login_loading:false});
			if (response && response.data && response.error===null) {
          this.props.authSetUserInfo(response.data);
	      	this.props.updateStartScreenState(true);
			} else {
				Toast.show('Email or Password is incorrect');
			}
		} catch (err) {
    }
    
  }
  doSignup = async () => {
		const { signup_email, signup_password,signup_name } = this.state;
		if (signup_email.length === 0 || signup_password.length === 0) {
			Toast.show('Please fill in all fields.');
			return;
		}
		if (!signup_email.toLowerCase().match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)) {
			Toast.show('Invalid Email Format');
			return;
		}
		try {
			this.setState({signup_loading:true});
			await this.props.authSetToken(Base64.btoa(signup_email + ':' + signup_password));
			let signup_data={};
			signup_data.email = signup_email;
			signup_data.password = signup_password;
			signup_data.name = signup_name;
			const signup_response = await signupApi(signup_data);
			
			if (signup_response && signup_response.error===null) {
				const login_response = await loginApi();
				this.setState({signup_loading:false});
				if (login_response && login_response.data && login_response.error===null) {
            this.props.authSetUserInfo(login_response.data);
	        	this.props.updateStartScreenState(true);
				} else {
					Toast.show('Email or Password is incorrect');
				}	
			} else {
				Toast.show(signup_response.error);
				this.setState({signup_loading:false});

			}
		} catch (err) {
    }
    
	}
  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, 40],
      extrapolate: 'clamp',
    });
    const transp = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });
    const padLogin = this.state.scrollY.interpolate({
      inputRange: [0, 0],
      outputRange: [40, 0],
      extrapolate: 'clamp',
    });
    const padSignup = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [windowHeight * 0.8, windowHeight * 0.16],
      extrapolate: 'clamp',
    });
    return (
      <SafeAreaView style={{alignItems: 'center', flex: 1}}>
          <ImageBackground style={{alignItems: 'center', flex: 1}} source={Images.Background_image}>
            <Animated.View
              style={[
                styles.carret,
                {
                  height: headerHeight,
                  opacity: transp,
                },
              ]}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  Animated.timing(this.state.scrollY, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: false,
                  }).start();
                }}>
					<View style={{width:500}}>
					<Animated.Text
                  style={{color: 'black', fontSize: 30, padding: padLogin, width:'100%',textAlign:'center'}}>
                  Log In
                </Animated.Text>
					</View>
                
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <View style={{width: '10%'}} />
                <View style={{width: '90%'}}>
                  <TextInput
                    style={{
                      width: windowWidth * 0.5,
                      height: 40,
                    }}
                    placeholderTextColor="black"
                    placeholder="Email"
										onChangeText={text => this.setState({login_email: text})}

                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={{width: '10%'}} />
                <View style={{width: '90%'}}>
                  <TextInput
                    style={{
                      width: windowWidth * 0.5,
                      height: 40,
                    }}
                    placeholderTextColor="black"
                    placeholder="Password"
										onChangeText={text => this.setState({login_password: text})}
										secureTextEntry={true}

                  />
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  {backgroundColor: 'black', justifyContent: 'center'},
                ]}
                onPress={() => this.doLogin()} 
                >
                  {this.state.login_loading ? (
										<ActivityIndicator size="large" color="white" />
										)
									:
									(
                <Text style={{fontWeight: 'bold', fontSize: 18,color:"white"}}>Log In</Text>
                )
                  }
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => this.goNext('ForgotPassword')}
              style={{paddingTop: 10}}>
                <Text style={{color: 'black', fontSize: 18}}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                {useNativeDriver: false},
              )}
              scrollEventThrottle={2}
              style={[styles.scrollView, {marginTop: padSignup}]}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.bottom}>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    Animated.timing(this.state.scrollY, {
                      toValue: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                      duration: 300,
                      easing: Easing.linear,
                      useNativeDriver: false,
                    }).start();
                  }}>
					  <View style={{textAlign:'center',width:500}}>
					  <Text style={{color: 'black', fontSize: 18,textAlign:'center'}}>
                    New Member?
                  </Text>
                  <Text style={{color: 'black', fontSize: 40,textAlign:'center'}}>Sign Up</Text>
					  </View>
                 
                </TouchableOpacity>
                <View style={styles.inputContainer2}>
                  <View style={{width: '10%'}} />
                  <View style={{width: '90%'}}>
                    <TextInput
                      style={{
                        width: windowWidth * 0.5,
                        height: 40,
                      }}
                      placeholderTextColor="black"
                      placeholder="Name"
										onChangeText={text => this.setState({signup_name: text})}

                    />
                  </View>
                </View>
                <View style={styles.inputContainer2}>
                  <View style={{width: '10%'}} />
                  <View style={{width: '90%'}}>
                    <TextInput
                      style={{
                        width: windowWidth * 0.5,
                        height: 40,
                      }}
                      placeholderTextColor="black"
                      placeholder="Email"
										onChangeText={text => this.setState({signup_email: text})}

                    />
                  </View>
                </View>
                <View style={styles.inputContainer2}>
                  <View style={{width: '10%'}} />
                  <View style={{width: '90%'}}>
                    <TextInput
                      style={{
                        width: windowWidth * 0.5,
                        height: 40,
                      }}
                      placeholderTextColor="black"
                      placeholder="Password"
  										secureTextEntry={true}
	  									onChangeText={text => this.setState({signup_password: text})}

                    />
                  </View>
                </View>
                {/* <View style={styles.inputContainer2}>
                  <View style={{width: '10%'}} />
                  <View style={{width: '90%'}}>
                    <TextInput
                      style={{
                        width: windowWidth * 0.5,
                        height: 40,
                      }}
                      placeholderTextColor="black"
                      placeholder="Confirm Password"
										  secureTextEntry={true}
										  onChangeText={text => this.setState({signup_c_password: text})}

                    />
                  </View>
                </View> */}
                <TouchableOpacity
                  style={[
                    styles.inputContainer2,
                    {backgroundColor: 'black', justifyContent: 'center'},
                  ]}
                  onPress={() => this.doSignup()}
                  >
                    {this.state.signup_loading ? (
										<ActivityIndicator size="large" color="white" />
										)
									:
									(
                  <Text style={{fontWeight: 'bold', fontSize: 18,color:"white"}}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ImageBackground>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    width: windowWidth,
    flex: 1,
  },
  carret: {
    backgroundColor: 'white',
    width: windowWidth * 0.8,
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 20,
  },
  bottom: {
    alignSelf: 'center',
    height: windowHeight,
    backgroundColor: 'white',
    width: windowWidth * 1.6,
    borderTopRightRadius: windowWidth,
    borderTopLeftRadius: windowWidth,
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: windowWidth * 0.64,
    opacity: 1,
    borderRadius: 500,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer2: {
    marginTop: 30,
    width: windowWidth * 0.7,
    opacity: 1,
    borderRadius: 500,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
});


function mapStateToProps(state) {
	return {
	};
  }
export default connect(mapStateToProps, {authSetUserInfo,authSetToken,updateStartScreenState})(withTheme(LoginScreen));
