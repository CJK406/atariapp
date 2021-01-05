import * as React from 'react';
import { SafeAreaView, StyleSheet, Text,TextInput, Image, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { authLogout, getMyRelation, getMyTickets, getMarketTickets, getNotifications, getPaymentHistory } from '../Redux/Actions';
import { LogoBox } from '../Components';
import { Images } from '../Assets';

class SendPaymentScreen extends React.Component {
    state = {
        drop1_flag:false,
        drop2_flag:false,
        drop1_key:0,
        drop2_key:0,
        darkmode:true,
        address:""
	}
	componentDidMount() {
	}
	componentWillUnmount() {
    }
    static getDerivedStateFromProps(props, state) {
        return {
            darkmode:props.darkmode,
            address: props.route.params.address,
        };
      }
	navigate = (pagename) => {
		this.props.navigation.navigate(pagename);
	}
  render() {
        const {darkmode} =this.state;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white' }}>
          <View>
              <Text>asef</Text>
          </View>
            {/* <View style={[CustomStyles.container, CustomStyles.innerContainer, styles.innerContainer]}>
                <View style={{height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <TouchableOpacity style={{position: 'absolute', left: 0}} onPress={() => this.goBack()}>
                        <Ionicons name="arrow-back-outline" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, color: 'white'}}>Notifications</Text>
                </View>
                <View style={{ backgroundColor:darkmode?'rgb(33,33,33)':'white',borderRadius:10,top:'30%',width:'100%',margin:0,borderTopRightRadius:50,borderTopLeftRadius:50}}>
                    <Image source={Images.btc_icon} style={{width:25,height:25,marginTop:20,justifyContent:'center',alignItems:'center',alignSelf:'center'}}></Image>
                    <Text style={{fontSize:30, color:darkmode?'white':'black',textAlign:'center',marginTop:10,marginBottom:20}}>Send amount</Text>
                    <View style={{flexDirection:'row',textAlign:'center',alignSelf:'center',alignItems:'center'}}>
                        <View style={{width:'45%',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                            <TextInput 
                                onChangeText={(key) => this.changeSendValue(key)}
                                value={this.state.send_amount}
                                placeholder="0.00"  
                                placeholderTextColor="white" 
                                keyboardType={'numeric'} 
                                style={{color:darkmode?'white':'black',backgroundColor:'transparent',fontSize:24}}></TextInput>
                            <Text style={{color:darkmode?'white':'black',fontSize:24}}>{Headers[currentTab]['text']}</Text>
                        </View>
                        <View style={{width:'10%'}}>
                            <Ionicons name='swap-horizontal-outline'  size={24} color={darkmode?"white":'black'} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                        </View>
                        <View style={{width:'45%',textAlign:'center',alignItems:'center',alignSelf:'center'}}>
                            <TextInput 
                            onChangeText={(key) => this.changeSendUsdValue(key)}
                            value={this.state.send_usd_amount}
                            placeholder="0.00" 
                            placeholderTextColor="white" 
                            keyboardType={'numeric'} 
                            style={{color:darkmode?'white':'black',backgroundColor:'transparent',fontSize:26}}></TextInput>
                            <Text style={{color:darkmode?'white':'black',fontSize:24}}>USD</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',textAlign:'center',justifyContent:'center',marginBottom:30,marginTop:40}}>
                        <TextInput placeholder="Tap to paste address" onChangeText={(key) => this.setState({send_address:key})} placeholderTextColor={darkmode?"white":"black"} style={{backgroundColor:'transparent',color:darkmode?'white':'black',width:'90%',height:50,borderBottomWidth:1,borderBottomColor:darkmode?'white':'black'}} >
                            {this.state.send_address}
                        </TextInput>
                        <TouchableOpacity onPress={() =>this.setState({qr_code_modal:true})} >
                            <Ionicons name='qr-code-outline'  size={20} color={darkmode?"white":'black'} style={{justifyContent:'center',alignSelf:'center',alignItems:'center'}} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.SendConfirm()} 
                        style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:200,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
                    >
                        <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
		justifyContent: 'flex-start',
		paddingTop: 0
	},
	customWriting: {
		fontSize: 12,
		color: '#7882A2'
	}
});

function mapStateToProps(state) {
  return {
        darkmode:state.Auth.darkmode

  };
}

export default connect(mapStateToProps, {})(withTheme(SendPaymentScreen));
