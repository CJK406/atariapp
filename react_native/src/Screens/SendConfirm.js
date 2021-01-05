import * as React from 'react';
import { SafeAreaView, StyleSheet, Text,Image,TextInput,TouchableOpacity, View, ScrollView,ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Images } from '../Assets';
import Modal from 'react-native-modal';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { confirm_payment} from '../Api';


const Headers = [{Image:Images.btc_icon,text:'BTC',color:'#f7931a',full_text:'bitcoin'},
{Image:Images.Atri_icon,text:'ATRI',color:'#ce2424',full_text:'atri'},
{Image:Images.Eth_icon,text:'ETH',color:'aqua',full_text:'ethereum'},
{Image:Images.Ltc_icon,text:'LTC',color:'#345c9c',full_text:'litecoin'},
{Image:Images.bch_icon,text:'BCH',color:'green',full_text:'bitcoincash'}];

class SendConfirmScreen extends React.Component {
    state = {
        show_miner_fee_modal:false,
        miner_fee:1,
        input_value:['','','','','',''],
        info:{},
        isLoading:false,
        darkmode:true,

    }
    static getDerivedStateFromProps(props, state) {
        return {
            info: props.route.params.info,
            darkmode:props.darkmode
        };
    }
	goBack = () => {
		this.props.navigation.goBack();
	}

	
    toggleModal = () => {
		this.setState({
			show_miner_fee_modal:!this.state.show_miner_fee_modal
		})
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

	SendConfirm = async () => {
        
        const {input_value, miner_fee, info} = this.state;
        if(input_value[0]!=="" && input_value[1]!=="" && input_value[2]!=="" && input_value[3]!==""&& input_value[4]!==""&& input_value[5]!==""){
            this.setState({isLoading:true});
            let pincode = "";
            for(let i=0; i<6; i++){
                pincode+=input_value[i];
            }
            pincode = parseInt(pincode);
            let data = {currency:Headers[info.currentTab]['text'].toLowerCase(),
                        amount:info.send_amount,
                        fee:miner_fee,
                        address:info.address,
                        pincode:pincode       
            }
            const result = await confirm_payment(Headers[info.currentTab]['text'].toLowerCase(),data);
            if(result.error!=="null"){
                alert(result.error);
            }
            this.setState({isLoading:false});


        }
    }

  render() {
        const radio_props = [
            {label: 'Economic', value: 1 },
            {label: 'Standard', value: 2 },
            {label: 'High Priority', value: 3 }
          ];
        const {info,darkmode} = this.state;
    return (
        <KeyboardAwareScrollView>
<SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white', height:'100%' }}>
        <View style={[CustomStyles.container,  styles.innerContainer]}>
            <View style={{height: 70, alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor:darkmode?'black':'white', width:'100%'}}>
                <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={() => this.goBack()}>
                    <Ionicons name="arrow-back-outline" size={20} color={darkmode?"white":'black'} />
                </TouchableOpacity>
                <Image source={Images.Logo} style={{width:160, height:50}} />
            </View>
            <View style={{padding:20}}>
                <Text style={{fontSize:25,color:darkmode?'white':'black'}}>Confirm Payment</Text>
                <Text style={{fontSize:20,color:darkmode?'white':'black',marginTop:20}}>SUMMARY</Text>
                <View style={{flexDirection:'row',marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Sending to</Text>
                    <View style={{flexDirection:'row',borderRadius:10,padding:2,paddingLeft:10,backgroundColor:'#3a3a3a',width:'50%'}}>
                        <Image source={Headers[info.currentTab]['Image']} style={{width:14,height:14,justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                        <Text style={{color:'white',paddingLeft:10,paddingRight:20}} numberOfLines={1}>{info.address}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row',marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Miner fee</Text>
                    <TouchableOpacity style={{textAlign:'right',alignItems:'flex-end',alignSelf:'flex-end',justifyContent:'flex-end', width:'50%'}} onPress={() => this.toggleModal(true)}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:darkmode?'#b5b5b5':'black'}}>{radio_props[this.state.miner_fee-1]['label']}</Text>
                            <Ionicons name="chevron-down-outline" size={20} style={{marginLeft:20}} color={darkmode?"white":'black'} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{marginBottom:20,fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Enter your pincode*</Text>
                    <View style={{flexDirection:'row'}}>
                            
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

                <View style={{flexDirection:'row',marginTop:20,marginBottom:30,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>TOTAL AMOUNT</Text>
                    <View style={{width:'50%',textAlign:'right',justifyContent:'flex-end',alignSelf:'flex-end',alignItems:'flex-end'}}>
                        <Text style={{fontSize:20,fontWeight:'700',marginBottom:5,color:darkmode?'white':'black'}}>{info.send_amount} {Headers[info.currentTab]['text']}</Text>
                        <Text style={{fontSize:17,color:darkmode?'white':'black'}}>{info.send_usd_amount} USD</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.SendConfirm()} 
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
            <Modal isVisible={this.state.show_miner_fee_modal}
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
            </Modal>
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
		darkmode: state.Auth.darkmode
  };
}

export default connect(mapStateToProps, {  })(withTheme(SendConfirmScreen));
