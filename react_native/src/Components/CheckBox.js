import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import Ionicons from 'react-native-vector-icons/Ionicons';

class CheckBox extends React.Component {
  render() {
		const { secondaryColor } = this.props.theme.palette;
		const { value, onChange } = this.props;
    return (
      <TouchableOpacity style={[styles.boxContainer]} onPress={() => onChange()}>
				{value && <Ionicons name="checkmark-outline" size={20} color={secondaryColor}/>}
			</TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
	boxContainer: {
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#23262C',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: 'rgba(112, 112, 112, 0.15)'
	}
});

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {})(withTheme(CheckBox));
