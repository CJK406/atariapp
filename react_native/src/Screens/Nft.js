import * as React from 'react';
import { StyleSheet,  View, FlatList,Text,
     Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { CustomStyles } from '../Constant';
import {  Header } from '../Components';

import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
const {  height } = Dimensions.get("window");
import PTRView from 'react-native-pull-to-refresh';

class NftScreen extends React.Component {
    state = {
        darkmode:true,

	}
	componentDidMount() {
    }
    

  static getDerivedStateFromProps(props, state) {
    return {
        darkmode:props.darkmode,
        
    };
  }
	
  render() {
        const {darkmode} = this.state;
        const themeBG = darkmode? 'black' : 'white'
        const renderItem = ({ item }) => (
            <View style={[CustomStyles.container, styles.innerContainer]}>
                <Header darkmode={darkmode}/>
                <View style={{textAlign:'center'}}>
                    <Text style={{color:'red', fontSize:13,textAlign:'center',marginTop:100}}>WELCOME TO THE</Text>
                    <Text style={{color:darkmode?'white' :'black', fontSize:35,textAlign:'center', marginTop:10}}>Atari NFT Universe</Text>
                    <Text style={{color:'gray',fontSize:15, textAlign:'center', marginTop:10}}>Buy, store and sell your NFTs</Text>
                    <Text style={{color:darkmode?'white' :'black',fontSize:17, textAlign:'center', marginTop:10}}>( Coming Soon )</Text>

                </View>
           </View>
    
          );
    return (
        <PTRView onRefresh={() => {}} style={{ backgroundColor: themeBG}}>
            {/* <ImageBackground style={{alignItems: 'center', flex: 1,}} source={darkmode ? Images.dashboard_background : null} > */}
            {darkmode && 
                <Image 
                    resizeMode="contain"
                    style={{
                        resizeMode:"cover", 
                        position:"absolute", 
                        top:0, 
                        bottom:0, 
                        flex: 1,
                        alignSelf: 'stretch',
                        width: '100%',
                        height: height,
                    }} 
                source={Images.nft_image}/>
            }
            <FlatList
                data={[1]}
                renderItem={renderItem}
            />
            {/* </ImageBackground> */}
        </PTRView>);
  }
}

const styles = StyleSheet.create({
  innerContainer: {
		justifyContent: 'flex-start',
		paddingTop: 0,
        height:height
	},
	customWriting: {
		fontSize: 12,
		color: '#7882A2'
	},
    balanceContainer:{
        paddingBottom: 20,
        paddingLeft: 20,
    }
});

function mapStateToProps(state) {
  return {
        darkmode:state.Auth.darkmode,
  };
}

export default connect(mapStateToProps, {})(withTheme(NftScreen));
