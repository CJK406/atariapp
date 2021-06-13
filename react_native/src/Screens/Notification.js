import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
class NotificationScreen extends React.Component {
	goBack = () => {
		this.props.navigation.goBack();
	}
  render() {
		const { primaryColor, secondaryColor, sixthColor } = this.props.theme.palette;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: primaryColor }}>
				<View style={[CustomStyles.container, CustomStyles.innerContainer, styles.innerContainer]}>
					<View style={{height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
						<TouchableOpacity style={{position: 'absolute', left: 0}} onPress={this.goBack}>
							<Ionicons name="arrow-back-outline" size={20} color="white" />
						</TouchableOpacity>
						<Text style={{fontSize: 18, color: 'white'}}>Notifications</Text>
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
  };
}

export default connect(mapStateToProps, {  })(withTheme(NotificationScreen));
