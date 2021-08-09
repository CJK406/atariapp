import * as React from 'react';
import { SafeAreaView, StyleSheet, Text,Image,TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles,Headers } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Images } from '../Assets';
import Modal from 'react-native-modal';
import RadioForm from 'react-native-simple-radio-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sendEther,sendAttari,sendUsdt,sendActionApi} from '../Api';
import { updateBallance,setAllHistory} from '../Redux/Actions';
import {InputPin,AwesomeAlert} from '../Components'
let backPressed = 0;

class SendConfirmScreen extends React.Component {
    constructor(props) {
		super(props)
        this.awesomeAlert = null
	}
    state = {
        show_miner_fee_modal:false,
        miner_fee:1,
        info:{},
        isLoading:false,
        darkmode:true,
        codePin :"",
        user_id:"",
        pincode:null,
        back_flag:false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isLoading != nextState.isLoading 
                || this.state.darkmode != nextState.darkmode 
                || this.state.codePin != nextState.codePin 
                || this.state.back_flag != nextState.back_flag 

    }
    static getDerivedStateFromProps(props, state) {
        return {
            info: props.route.params.info,
            darkmode:props.darkmode,
            user_id:props.user_id,
            pincode:props.pincode,
            id:props.id,
            email:props.email,
            name:props.name
        };
    }

	goBack = () => {
        const {back_flag} = this.state;
		if(!back_flag){
    		this.props.navigation.goBack();

		}
	}
   
    toggleModal = () => {
		this.setState({
			show_miner_fee_modal:!this.state.show_miner_fee_modal
		})
    }
	SendConfirm = () => {
        const {codePin, pincode,miner_fee, info,user_id} = this.state;
        if(codePin!==""){
            // this.setState({isLoading:true});
            
            let input_pincode = parseInt(codePin);
            let  user_pincode= parseInt(pincode);
            if(input_pincode !== user_pincode){
                this.awesomeAlert.showAlert('error', "Failed!","Pincode is not correct");
            }
            else{
               
                let currency = Headers[info.currentTab]['text'];
                if(currency ==="ATRI")
                    currency="ATARI";
                let data = {token:currency,
                            amount:parseFloat(info.send_amount),
                            to:info.address,
                            code:input_pincode
                }
                let result = sendAttari(data);
                this.goBack();
            }            
        }
        else{
            this.awesomeAlert.showAlert('error', "Failed!","Pincode is not correct");
        }
    }
    elipsisText(value){
        var splitIndex = Math.round( value.length * 0.8 );
		this.fullText = value;
        return {
            leftText:value.slice( 0, splitIndex ),
            rightText : value.slice( splitIndex )
        }
    }
  render() {
        const radio_props = [
            {label: 'Economic', value: 1 },
            {label: 'Standard', value: 2 },
            {label: 'High Priority', value: 3 }
          ];
        const {info,darkmode} = this.state;
        const {leftText, rightText} = this.elipsisText(info.address)
    return (
        <KeyboardAwareScrollView style={{backgroundColor:darkmode?'rgb(33,33,33)':'white'}}>
        <SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white', height:'100%' }}>
        <AwesomeAlert ref={(ref) => this.awesomeAlert = ref }/> 
        <View style={[CustomStyles.container,  styles.innerContainer]}>
            <View style={{height: 70, alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor:darkmode?'black':'white', width:'100%'}}>
                <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={this.goBack}>
                    <Ionicons name="arrow-back-outline" size={20} color={darkmode?"white":'black'} />
                </TouchableOpacity>
                <Image source={Images.Logo} style={{width:160, height:50}} />
            </View>
            <View style={{padding:20}}>
                <Text style={{fontSize:25,color:darkmode?'white':'black'}}>Confirm Payment</Text>
                <Text style={{fontSize:20,color:darkmode?'white':'black',marginTop:20}}>SUMMARY</Text>
                <View style={{flexDirection:'row',marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20, justifyContent:'space-between'}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Sending to</Text>
                    <View style={{flexDirection:'row',borderRadius:10,padding:2,paddingLeft:10,backgroundColor:'#3a3a3a'}}>
                        <Image source={Headers[info.currentTab]['Image']} style={{width:14,height:14,justifyContent:'center',alignSelf:'center',alignItems:'center',maxWidth:'50%'}} />
                        <View style={{flexDirection:"row",paddingLeft:10,paddingRight:20}}>
                            <Text style={{color:'white', width:60}} numberOfLines={1}>{leftText}</Text>
                            <Text style={{color:'white'}} numberOfLines={1}>{rightText}</Text>
                        </View>
                    </View>
                </View>

                {/* <View style={{flexDirection:'row',marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Miner fee</Text>
                    <TouchableOpacity style={{textAlign:'right',alignItems:'flex-end',alignSelf:'flex-end',justifyContent:'flex-end', width:'50%'}} onPress={() => this.toggleModal(true)}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:darkmode?'#b5b5b5':'black'}}>{radio_props[this.state.miner_fee-1]['label']}</Text>
                            <Ionicons name="chevron-down-outline" size={20} style={{marginLeft:20}} color={darkmode?"white":'black'} />
                        </View>
                    </TouchableOpacity>
                </View> */}

                <View style={{marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{marginBottom:20,fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Enter your pincode*</Text>
                    <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                        <InputPin value={this.state.codePin}
                            codeLength={6}
                            cellStyle={{
                                backgroundColor: darkmode ? 'white':'#3a3a3a',
                            }}
                            onTextChange={code => this.setState({codePin:code})}
                            textStyle={{fontSize: 24,color: darkmode ? 'black':'white'}}
                        />
                     </View>
                </View>

                <View style={{flexDirection:'row',marginTop:20,marginBottom:30,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>TOTAL AMOUNT</Text>
                    <View style={{width:'50%',textAlign:'right',justifyContent:'flex-end',alignSelf:'flex-end',alignItems:'flex-end'}}>
                        <Text style={{fontSize:20,fontWeight:'700',marginBottom:5,color:darkmode?'white':'black'}}>{info.send_amount} {Headers[info.currentTab]['text']}</Text>
                        <Text style={{fontSize:17,color:darkmode?'white':'black'}}>{info.send_usd_amount} USD</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={this.SendConfirm} 
                    style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:20,marignTop:20,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
                >
                    {this.state.isLoading ? (
                        <ActivityIndicator size="large" color="white" />
                    )
                :
                (
                    <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>SEND</Text>
                )
                }
                </TouchableOpacity>
            </View>
            {/* <Modal isVisible={this.state.show_miner_fee_modal}
                onBackdropPress={() => this.toggleModal(false)}
                style={{margin:0}}
            >
                <View style={{ backgroundColor:'rgb(33,33,33)',borderRadius:10,top:'34%',width:'100%',margin:0,borderTopRightRadius:50,borderTopLeftRadius:50}}>
                    <View style={{backgroundColor:'rgb(22,22,22)',paddingTop:20,paddingBottom:10,borderTopRightRadius:50,borderTopLeftRadius:50}}>
                        <Text style={{fontSize:18, textAlign:'center',color:'white'}}>Miner fee</Text>
                    </View>
                    <View style={{padding:20}}>
                     <RadioForm
                        radio_props={radio_props}
                        initial={this.state.miner_fee-1}
                        onPress={(value) => {this.setState({miner_fee:value,show_miner_fee_modal:false})}}
                        buttonSize={20}
                        labelStyle={{fontSize: 16, color: 'white'}}
                        buttonWrapStyle={{marginTop: 40}}
                        />
                    </View>
                </View>
            </Modal> */}
        </View>
      </SafeAreaView>
        </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  innerContainer: {
		justifyContent: 'flex-start',
		paddingTop: 0
	},
	itemStyle: {
		borderBottomColor: '#707070',
		flexDirection: 'row',
		paddingBottom: 15,
		paddingTop: 15,
		borderBottomWidth: 1
	}
});

function mapStateToProps(state) {
  return {
		darkmode: state.Auth.darkmode,
        user_id:state.Auth.user_id,
        pincode:state.Auth.pincode,
        name:state.Auth.user_name,
        email:state.Auth.email,
        id:state.Auth.user_id

  };
}

export default connect(mapStateToProps, { updateBallance,setAllHistory })(withTheme(SendConfirmScreen));
