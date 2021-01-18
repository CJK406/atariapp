import * as React from 'react';
import { SafeAreaView, Text, Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';

class StartScreen extends React.Component {
	goNext = (location) => {
		this.props.navigation.navigate(location);
	}
	componentDidMount() {
		setTimeout(() => {
			this.goNext('Login');
		}, 4000);
	}
  render() {
	const { primaryColor, secondaryColor } = this.props.theme.palette;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: primaryColor}}>
		<View style={[CustomStyles.container]}>
			<Image source={Images.start_animation} style={{justifyContent:'center', width:'100%',height:'100%'}} />
		</View>
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
	return {
	};
  }
export default connect(mapStateToProps, {})(withTheme(StartScreen));
