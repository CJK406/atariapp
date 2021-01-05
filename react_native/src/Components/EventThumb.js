import * as React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

class EventThumb extends React.Component {
	goToDetail = () => {
		this.props.navigation.navigate('EventDetail', { info: this.props.info });
	}

  render() {
		const { primaryColor, secondaryColor } = this.props.theme.palette;
		const { title, poster, price, createdAt, description, location, likes, dislikes, creator } = this.props.info;
    return (
      <View style={[CustomStyles.container, styles.eventContainer, { backgroundColor: primaryColor, paddingBottom: 10, margin:5, marginBottom: 15 }]}>
				<TouchableOpacity style={[styles.detailBtn]} onPress={e => this.goToDetail()}>
					<Ionicons name="push-outline" size={17} color={primaryColor} />
				</TouchableOpacity>
				<Image source={{ uri: poster }} style={{ resizeMode: 'stretch', height: 200 }}/>
				<View style={{padding: 10, backgroundColor: '#262C34'}}>
					<View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
						<Text style={{color: secondaryColor, fontSize: 12}}>{moment(createdAt).format('ddd, MMM D, YYYY h:m A')}</Text>
						<Text style={{fontSize: 13, fontWeight: 'bold', color: '#07A4FF'}}>${price}</Text>
					</View>
					<Text style={[styles.title, styles.thumbText, {marginTop: 5}]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
					<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]}>by {creator.first_name} {creator.last_name}</Text>
					<Text style={[styles.thumbText, styles.description, {marginTop: 5}]} numberOfLines={2} ellipsizeMode="tail">{description}</Text>
					<Text style={[styles.creator, styles.thumbText, {marginTop: 15}]}>Location</Text>
					<Text style={[styles.creator, styles.thumbText]}>{location}</Text>
					{!this.props.patron_view ? 
						<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]}>{likes.length} like, {dislikes.length} dislike</Text> :
						<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]}>{likes.length} like</Text>
					}
				</View>
			</View>
    );
  }
}

const styles = StyleSheet.create({
	eventContainer: {
		position: 'relative',
		shadowColor: '#000',
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.32,
		shadowRadius: 5.46,
		elevation: 9
	},
	thumbText: {
		color: 'white'
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	creator: {
		fontSize: 11
	},
	description: {
		fontSize: 13
	},
	detailBtn: {
		width: 25,
		height: 25,
		borderRadius: 12,
		backgroundColor: 'white',
		position: 'absolute',
		right: 11,
		top: 7,
		zIndex: 10,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

function mapStateToProps(state) {
  return {
		patron_view: state.view.patron_view
  };
}

export default connect(mapStateToProps, {})(withTheme(EventThumb));
