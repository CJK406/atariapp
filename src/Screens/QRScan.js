import * as React from 'react';
import {  SafeAreaView, StyleSheet,Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
class QRScanScreen extends React.Component {
  constructor(props) {
		super(props)
		
	}
  status = {
		send_address:"",
  }
	goBack = () => {
		this.props.navigation.goBack();
  }


  onSuccess = async e => {
    let address = e.data;
    this.props.navigation.navigate('SendPayment',{address:address});
		this.setState({
			send_address:address,
		})
	};

  render() {
    const { primaryColor } = this.props.theme.palette;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: primaryColor }}>
			<QRCodeScanner
          onRead={this.onSuccess}
          topViewStyle={{flex: 0}}
          bottomViewStyle={{flex: 0}}
          cameraStyle={{height: Dimensions.get('window').height}}
          flashMode={RNCamera.Constants.FlashMode.off}
      />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
		justifyContent: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0
	},
	customWriting: {
		fontSize: 12,
		color: '#7882A2'
	},
});
function mapStateToProps(state) {
	return {
	};
  }
export default connect(mapStateToProps,{})(withTheme(QRScanScreen));
