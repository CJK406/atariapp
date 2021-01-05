import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { getMyTickets, getMarketTickets } from '../Redux/Actions';
import { transferToMarket as transferToMarketApi, sendToFriend as sendToFriendApi, deleteTicket as deleteTicketApi } from '../Api';

class TicketThumb extends React.Component {
	state = {
		showTransferModal: false,
		transfer_amount: '',
		transfer_price: '',

		showSendModal: false,
		send_amount: '',
		selected_friend: 0
	}

	toggleTransferModal = () => {
		this.setState({ showTransferModal: !this.state.showTransferModal });
	}

	toggleSendModal = () => {
		this.setState({ showSendModal: !this.state.showSendModal });
	}

	showDeleteDialog = async () => {
		Alert.alert('Remove Ticket', 'You will not access your ticket again!', [
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: () => { this.doDelete(); }
			}
		]);
	}

	doDelete = async () => {
		try {
			const response = await deleteTicketApi(this.props.info.id)
			if (response && response.data) {
				Toast.show('Success');
				this.props.getMyTickets();
				this.props.getMarketTickets();
			} else {
				let errors = response.errors || [];
				let messages = [];
				for (var i=0; i< errors.length; i++) {
					messages.push(errors[i].message)
				}
				if (messages.length === 0) {
					messages.push('Unknown error')
				}
				Toast.show(messages[0]);
			}
		} catch (err) {
			Toast.show('An error occured. Please try again later');
		}
	}

	doTransfer = async () => {
		const { transfer_amount, transfer_price } = this.state;
		if (transfer_amount.length === 0 || transfer_price.length === 0) {
			Toast.show('Please input all fields.');
			return;
		}

		if (parseInt(transfer_amount, 10) > parseInt(this.props.info.amount)) {
			Toast.show(`You have only ${this.props.info.amount} tickets.`);
			return;
		}

		try {
			const response = await transferToMarketApi({ amount: parseInt(transfer_amount, 10), price: parseFloat(transfer_price), ticket_id: this.props.info.id})
			if (response && response.data) {
				Toast.show('Success');
				this.props.getMarketTickets();
				this.setState({ showTransferModal: !this.state.showTransferModal, transfer_amount: '', transfer_price: '' });
			} else {
				let errors = response.errors || [];
				let messages = [];
				for (var i=0; i< errors.length; i++) {
					messages.push(errors[i].message)
				}
				if (messages.length === 0) {
					messages.push('Unknown error')
				}
				Toast.show(messages[0]);
			}
		} catch (err) {
			Toast.show('An error occured. Please try again later');
		}
	}

	doSend = async () => {
		const { send_amount, selected_friend } = this.state;
		if (send_amount.length === 0) {
			Toast.show('Please input all fields.');
			return;
		}

		if (selected_friend === 0) {
			Toast.show('Please select a friend');
			return;
		}

		if (parseInt(send_amount, 10) > parseInt(this.props.info.amount)) {
			Toast.show(`You have only ${this.props.info.amount} tickets.`);
			return;
		}
		try {
			const response = await sendToFriendApi({ amount: parseInt(send_amount, 10), ticket_id: this.props.info.id, friend_id: selected_friend})
			if (response && response.data) {
				Toast.show('Success');
				this.props.getMyTickets();
				this.setState({ showSendModal: !this.state.showSendModal, send_amount: '', selected_friend: 0 });
			} else {
				let errors = response.errors || [];
				let messages = [];
				for (var i=0; i< errors.length; i++) {
					messages.push(errors[i].message)
				}
				if (messages.length === 0) {
					messages.push('Unknown error')
				}
				Toast.show(messages[0]);
			}
		} catch (err) {
			Toast.show('An error occured. Please try again later');
		}
	}

	renderTransferModal = () => {
		const { primaryColor, forthColor } = this.props.theme.palette;
		const { showTransferModal, transfer_amount, transfer_price } = this.state;
		return (
			<Modal isVisible={showTransferModal}>
				<View style={{backgroundColor: primaryColor, borderRadius: 10, padding: 20}}>
					<Text style={{color: 'white', textAlign: 'center', fontSize: 16, marginBottom: 20}}>Transfer To Market</Text>
					<TextInput
						style={{...CustomStyles.textInput, marginBottom: 10}}
						onChangeText={text => this.setState({transfer_amount: text})}
						value={transfer_amount}
						placeholder="Amount"
						keyboardType="number-pad"
						placeholderTextColor={forthColor}
						/>
					<TextInput
						style={{...CustomStyles.textInput, marginBottom: 20}}
						onChangeText={text => this.setState({transfer_price: text})}
						value={transfer_price}
						placeholder="New Price"
						keyboardType="number-pad"
						placeholderTextColor={forthColor}
						/>
					<View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
						<TouchableOpacity onPress={() => this.toggleTransferModal()}>
							<Text style={{color:'white', fontSize: 13}}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{marginLeft: 40}}  onPress={() => this.doTransfer()}>
							<Text style={{color:'white', fontSize: 13}}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		)
	}

	renderSendModal = () => {
		const { primaryColor, secondaryColor, forthColor } = this.props.theme.palette;
		const { showSendModal, send_amount, selected_friend } = this.state;
		return (
			<Modal isVisible={showSendModal}>
				<View style={{backgroundColor: primaryColor, borderRadius: 10, padding: 20}}>
					<Text style={{color: 'white', textAlign: 'center', fontSize: 16, marginBottom: 20}}>Send to Friend</Text>
					<TextInput
						style={{...CustomStyles.textInput, marginBottom: 20}}
						onChangeText={text => this.setState({send_amount: text})}
						value={send_amount}
						placeholder="Amount"
						keyboardType="number-pad"
						placeholderTextColor={forthColor}
						/>
					<ScrollView style={{height: 200}}>
						{this.props.followers.map((item, index) => <TouchableOpacity onPress={() => this.setState({selected_friend: item.follower.id})} style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}} key={index}>
							<Image source={{uri: item.follower.photo}} style={{width: 38, height: 38, borderRadius: 19, marginRight: 10}}/>
							<Text style={[{color: 'white', fontSize: 13}, selected_friend === item.follower.id && { color: secondaryColor} ]}>{item.follower.first_name} {item.follower.last_name}</Text>
						</TouchableOpacity>)}
					</ScrollView>
					<View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
						<TouchableOpacity onPress={() => this.toggleSendModal()}>
							<Text style={{color:'white', fontSize: 13}}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{marginLeft: 40}}  onPress={() => this.doSend()}>
							<Text style={{color:'white', fontSize: 13}}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		)
	}

  render() {
		const { primaryColor, secondaryColor } = this.props.theme.palette;
		const { type, info } = this.props;
    return (
      <View style={[CustomStyles.container, styles.ticketContainer, { backgroundColor: primaryColor }]}>
				<View style={{flex: 1, paddingRight: 25}}>
					<Text style={{color: secondaryColor, fontSize: 12}}>{moment(info.eventinfo.start_date).format('ddd, MMM D, YYYY h:m A')}</Text>
					<Text style={[styles.title, styles.thumbText, {marginTop: 5}]} numberOfLines={2} ellipsizeMode="tail">{info.eventinfo.title}</Text>
					<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]} numberOfLines={1} ellipsizeMode="tail">by {info.eventinfo.creator.first_name} {info.eventinfo.creator.last_name}</Text>
					<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]} numberOfLines={1} ellipsizeMode="tail">Amount: {info.amount}</Text>
				</View>
				<View style={{alignItems: 'flex-end'}}>
					<TouchableOpacity style={[styles.detailBtn, styles.delBtn]} onPress={() => this.showDeleteDialog()}>
						<Ionicons name="trash-outline" size={17} color="white" />
					</TouchableOpacity>
					{/* {type <= 1 && <TouchableOpacity style={{marginTop: 5}}>
						<Text style={{color: '#07A4FF', fontSize: 13, textDecorationLine: 'underline'}}>Refund</Text>
					</TouchableOpacity>} */}
					{type === 0 && <TouchableOpacity style={{marginTop: 5}} onPress={() => this.toggleTransferModal()}>
						<Text style={{color: '#827AF3', fontSize: 13, textDecorationLine: 'underline'}}>Put to Market</Text>
					</TouchableOpacity>}
					{type === 0 && <TouchableOpacity style={{marginTop: 10}} onPress={() => this.toggleSendModal()}>
						<Text style={{color: secondaryColor, fontSize: 13, textDecorationLine: 'underline'}}>Send To Friend</Text>
					</TouchableOpacity>}
				</View>
				{this.renderTransferModal()}
				{this.renderSendModal()}
			</View>
    );
  }
}

const styles = StyleSheet.create({
	ticketContainer: {
		position: 'relative',
		shadowColor: '#000',
		borderRadius: 10,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.32,
		shadowRadius: 5.46,
		elevation: 9,
		margin:5,
		marginBottom: 15,
		padding: 10,
		flexDirection: 'row'
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
		alignItems: 'center',
		justifyContent: 'center'
	},
	delBtn: {
		backgroundColor: '#FF3366'
	}
});

function mapStateToProps(state) {
  return {
		followers: state.relation.followers,
  };
}

export default connect(mapStateToProps, { getMyTickets, getMarketTickets })(withTheme(TicketThumb));
