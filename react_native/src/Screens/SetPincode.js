import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authSetPincode } from '../Redux/Actions';

class SetPincodeScreen extends React.Component {
	state = {
        email: '',
        input_value:['','','','','',''],

    }
    changeEvent = (e,index) => {
        const input_value = this.state.input_value;
        input_value[index] = e[e.length-1];
        this.setState({
            input_value:input_value
        });
        if(index==0)
            this.SecondTextInput.focus();
        if(index==1)
            this.ThirdTextInput.focus();
        if(index==2)
            this.FirthTextInput.focus();
        if(index==3)
            this.FifthTextInput.focus();
        if(index==4)
            this.SixthTextInput.focus();
    }

    SetPin(){
        const {input_value} =this.state;
        let pincode = "";
            for(let i=0; i<6; i++){
                pincode+=input_value[i];
            }
            pincode = parseInt(pincode);
        let data = {pincode:pincode};
        if(input_value[0]!=="" && input_value[1]!=="" && input_value[2]!=="" && input_value[3]!=="" &&input_value[4]!=="" &&input_value[5]!=="")
        {
            this.props.authSetPincode(data);
		    this.props.navigation.navigate('Dashboard');
        }
        else{
			Toast.show('Please fill up all the cells properly.');
        }
    }
  render() {
    return (
        <KeyboardAwareScrollView>

      <SafeAreaView style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)' }}>
			<View style={[CustomStyles.container]}>
                <View>
                    <View>
                        <Image source={Images.reset_pin_animation} style={{width:'100%',height:250}}></Image>
                        <Text style={{color:'white',fontSize:25, textAlign:'center',marginTop:30,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>Set your pin code</Text>
                        <Text style={{color:'white',fontSize:16, width:'90%', textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:10,marginBottom:40}}>Will be requested when making a transaction</Text>
                    </View>
                    <View style={{marginTop:20,paddingBottom:20}}>
                        <View style={{flexDirection:'row',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                            <TextInput
                                onChangeText={(e) => this.changeEvent(e,0)}
                                ref={(input) => { this.FirstTextInput = input; }}
                                blurOnSubmit={false}
                                keyboardType={'numeric'}
                                value={this.state.input_value[0]}
                                style={{fontSize:20,textAlign:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',width:50,height:50,marginLeft:10}}
                            />
                            <TextInput
                                onChangeText={(e) => this.changeEvent(e,1)}
                                ref={(input) => { this.SecondTextInput = input; }}
                                blurOnSubmit={false}
                                keyboardType={'numeric'}
                                value={this.state.input_value[1]}
                                style={{fontSize:20,textAlign:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',width:50,height:50,marginLeft:10}}
                            />

                            <TextInput
                                onChangeText={(e) => this.changeEvent(e,2)}
                                ref={(input) => { this.ThirdTextInput = input; }}
                                blurOnSubmit={false}
                                keyboardType={'numeric'}
                                value={this.state.input_value[2]}
                                style={{fontSize:20,textAlign:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',width:50,height:50,marginLeft:10}}
                            />
                            <TextInput
                                onChangeText={(e) => this.changeEvent(e,3)}
                                ref={(input) => { this.FirthTextInput = input; }}
                                blurOnSubmit={false}
                                keyboardType={'numeric'}
                                value={this.state.input_value[3]}
                                style={{fontSize:20,textAlign:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',width:50,height:50,marginLeft:10}}
                            />
                            <TextInput
                                onChangeText={(e) => this.changeEvent(e,4)}
                                ref={(input) => { this.FifthTextInput = input; }}
                                blurOnSubmit={false}
                                keyboardType={'numeric'}
                                value={this.state.input_value[4]}
                                style={{fontSize:20,textAlign:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',width:50,height:50,marginLeft:10}}
                            />
                            <TextInput
                                onChangeText={(e) => this.changeEvent(e,5)}
                                ref={(input) => { this.SixthTextInput = input; }}
                                blurOnSubmit={false}
                                keyboardType={'numeric'}
                                value={this.state.input_value[5]}
                                style={{fontSize:20,textAlign:'center',backgroundColor:'white',borderWidth:1,borderColor:'black',width:50,height:50,marginLeft:10}}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.SetPin()} 
                        style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:200,textAlign:'center',justifyContent:'center',padding:20,borderRadius:10,alignSelf:'center',alignItems:'center'}}
                    >
                        {this.state.loading ? (
                            <ActivityIndicator size="large" color='white'/>
                        ):(
                            <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Verify</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
      </SafeAreaView>
      </KeyboardAwareScrollView>
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
    console.log(state.Auth);
	return {
        pincode:state.Auth.pincode
	};
  }
export default connect(mapStateToProps, {authSetPincode})(withTheme(SetPincodeScreen));
