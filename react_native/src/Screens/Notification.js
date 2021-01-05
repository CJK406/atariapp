import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { readNotification as readNotificationApi } from '../Api';
import { readNotification } from '../Redux/Actions';

class NotificationScreen extends React.Component {
	goBack = () => {
		this.props.navigation.goBack();
	}

	viewDetail = (item) => {
		if (item.read === 0) {
			readNotificationApi(item.id);
			this.props.readNotification(item.id)
		}
		this.props.navigation.navigate('NotificationDetail', { info: item })
	}

  render() {
		const { primaryColor, secondaryColor, sixthColor } = this.props.theme.palette;
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: primaryColor }}>
				<View style={[CustomStyles.container, CustomStyles.innerContainer, styles.innerContainer]}>
					<View style={{height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
						<TouchableOpacity style={{position: 'absolute', left: 0}} onPress={() => this.goBack()}>
							<Ionicons name="arrow-back-outline" size={20} color="white" />
						</TouchableOpacity>
						<Text style={{fontSize: 18, color: 'white'}}>Notifications</Text>
					</View>
					<ScrollView style={{flex: 1, margin: -15, marginTop: 0, padding: 15, paddingTop: 0}} contentContainerStyle={{paddingBottom: 15}}>
						{this.props.notifications.map((item, index) => <TouchableOpacity onPress={() => this.viewDetail(item)} style={{...styles.itemStyle}} key={index}>
							<Ionicons name="mail-open-outline" size={23} color="white" />
							<View style={{flex: 1, marginLeft: 15}}>
								<Text style={{fontSize: 16, color: item.read === 0 ? secondaryColor : 'white'}} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
								<Text style={{fontSize: 14, color: sixthColor}} numberOfLines={1} ellipsizeMode="tail">{item.content}</Text>
							</View>
						</TouchableOpacity>)}
					</ScrollView>
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
		notifications: state.notification.notifications
  };
}

export default connect(mapStateToProps, { readNotification })(withTheme(NotificationScreen));
