import * as React from 'react';
import { SafeAreaView, StyleSheet, Text,ActivityIndicator, TouchableOpacity, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Images } from '../Assets';
import { reset_pin} from '../Api';
import Toast from 'react-native-simple-toast';

class ResetPinScreen extends React.Component {
    state ={
        darkmode:true,
        loading:false,
    }
    static getDerivedStateFromProps(props, state) {
        return {
            darkmode:props.darkmode,
        };
      }
	goBack = () => {
		this.props.navigation.goBack();
    }
    reset_pin = async () =>
    {
        this.setState({
            loading:true
        })
        const result = await reset_pin();
	    Toast.show('Your pin has been successfully set to you email');
        this.setState({
            loading:false,
        })
    }
  render() {
      const {darkmode} =this.state;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: darkmode?'rgb(33,33,33)':'white' }}>
            <View style={[CustomStyles.container]}>
                <View style={{backgroundColor:darkmode?'black':'white',height: 74, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={this.goBack}>
                        <Ionicons name="arrow-back-outline" size={20} color={darkmode?"white":'black'} />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, color: darkmode?'white':'black'}}>Reset Pincode</Text>
                </View>
                <View>
                    <View>
                        <Image source={Images.reset_pin_animation} style={{width:'100%',height:250}}></Image>
                        <Text style={{color:darkmode?'white':'black',fontSize:20, width:'90%', textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'center',marginTop:40,marginBottom:40}}>An email will be sent to your registered email address</Text>
                    </View>
                    <TouchableOpacity onPress={this.reset_pin} 
                        style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:200,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
                    >
                        {this.state.loading ? (
                            <ActivityIndicator size="large" color='white'/>
                        ):(
                            <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>RESET</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
      </SafeAreaView>
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
      darkmode:state.Auth.darkmode
  };
}

export default connect(mapStateToProps, {  })(withTheme(ResetPinScreen));
