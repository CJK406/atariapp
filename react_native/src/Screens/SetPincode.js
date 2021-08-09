import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, ActivityIndicator,TouchableOpacity, View} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authSetPincode } from '../Redux/Actions';
import {InputPin} from '../Components'

class SetPincodeScreen extends React.Component {
	state = {
        pincode:null,
        loading:false,
        codePin:"",
        user_id:""
    }
    static getDerivedStateFromProps(props, state) {
        return{
            pincode:props.pincode,
            user_id:props.user_id
        };
        
    }
    goNext(page){
        this.props.navigation.navigate(page);
    }

    SetPin = () => {
        const {codePin,user_id} =this.state;
        console.log("codepin",codePin)
        let pincode = codePin;
            // pincode = parseInt(pincode);
        let data = {pinCode:pincode,id:user_id};
        console.log(data);
        if(codePin!=="" && codePin.length === 6)
        {
            this.setState({
                loading:true,
            })
            this.props.authSetPincode(data);
        }
        else{
			Toast.show('Please fill up all the cells properly.');
        }
    }
  render() {      
    return (
        

      <SafeAreaView style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)' }}>
          <KeyboardAwareScrollView >
			<View style={[CustomStyles.container]}>
                <View>
                    <View>
                        <Image source={Images.reset_pin_animation} style={{width:'100%',height:250}}></Image>
                        <Text style={{color:'white',fontSize:25, textAlign:'center',marginTop:30,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>Set your pin code</Text>
                        <Text style={{color:'white',fontSize:16, width:'90%', textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:10,marginBottom:40}}>Will be requested when making a transaction</Text>
                    </View>
                    <View style={{marginTop:20,paddingBottom:20, justifyContent:"center", flex:1,alignItems:'center'}}>
                        <InputPin value={this.state.codePin} 
                            codeLength={6}
                            cellStyle={{
                                backgroundColor: '#eee',
                                borderColor:'gray'
                            }}
                            cellStyleFocused={{
                                borderColor: 'black', 
                                backgroundColor: 'white'
                            }}
                            onTextChange={code => this.setState({codePin:code})}
                            textStyle={{fontSize: 24,color: 'black'}}
                            // onFulfill={() => {
                            //     Keyboard.dismiss();
                            // }}
                        />
                    </View>
                    <TouchableOpacity onPress={this.SetPin} 
                        style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:20,textAlign:'center',justifyContent:'center',padding:20,borderRadius:10,alignSelf:'center',alignItems:'center'}}
                    >
                        {this.state.loading ? (
                            <ActivityIndicator size="large" color='white'/>
                        ):(
                            <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Verify</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAwareScrollView>
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
        pincode:state.Auth.pincode,
        user_id:state.Auth.user_id
	};
  }
export default connect(mapStateToProps, {authSetPincode})(withTheme(SetPincodeScreen));
