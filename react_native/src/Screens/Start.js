import * as React from 'react';
import { SafeAreaView, Text, Image, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { Images } from '../Assets';
import { CustomStyles } from '../Constant';
import Video from "react-native-video";
const { width, height } = Dimensions.get("window");
import { updateMenuStatus} from '../Redux/Actions';


class StartScreen extends React.Component {
	state = {
		activeTab: 1,
		page:0,
		menuDelay:false,
		user_id:"",
		loggedin:false,
		pincode:"",
		start_screen_flag:false
	}
	static getDerivedStateFromProps(props, state) {
		return {
			loggedin:props.loggedin,
			start_screen_flag:props.start_screen_flag
		};
	  }
	goNext = () => {
		this.props.onFinish();
		if(this.state.loggedin){
			this.props.updateMenuStatus(true);
		}
		this.props.onFinish();
	}

	componentDidMount() {
		this.props.updateMenuStatus(false);

	}
  render() {
	if(this.state.start_screen_flag===true){
		this.props.onFinish();
		this.props.updateMenuStatus(true);

	}
    return (
      <SafeAreaView style={{...CustomStyles.container}}>
			<Video
				source={Images.start_video}
				style={{height: height,
					position: "absolute",
					top: 0,
					left: 0,
					alignItems: "stretch",
					bottom: 0,
					right: 0}}
				resizeMode={"cover"}
				onEnd={() => this.goNext()}
				/>
		
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
	return {
		loggedin: state.Auth.loggedin,
		start_screen_flag:state.Auth.start_screen_flag,
	};
  }
export default connect(mapStateToProps, {updateMenuStatus})(withTheme(StartScreen)); 
