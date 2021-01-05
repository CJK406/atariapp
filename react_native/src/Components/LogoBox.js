import * as React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';;
import { changeView } from '../Redux/Actions';

class LogoBox extends React.Component {
  render() {
    const styles = this.props.style || {};
    return (
      <TouchableOpacity onPress={() => this.props.changeView()} style={{...styles}}>
				<Image source={Images.SmallLogo} />
			</TouchableOpacity>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, { changeView })(withTheme(LogoBox));
