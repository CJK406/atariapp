import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles } from '../Constant';
import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { Images } from '../Assets';
import { getMarketTickets, getMyTickets } from '../Redux/Actions';
import stripe from 'tipsi-stripe';
import { deleteFromMarket as deleteFromMarketApi, buyOnMarket as buyOnMarketApi } from '../Api';

class MarketTicketThumb extends React.Component {
	state = {
    showBuyModal: false,
    buy_amount: '',
	}
  
  toggleBuyModal = () => {
		this.setState({ showBuyModal: !this.state.showBuyModal });
	}

	backFromMarket = async () => {
		try {
			const response = await deleteFromMarketApi(this.props.info.id);
			if (response && response.data) {
        this.props.getMarketTickets();
				Toast.show('Success');
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

  gotoBuy = async () => {
		const { buy_amount } = this.state;
		if (buy_amount.length === 0) {
			Toast.show('Invalid amount');
			return;
    }
    if (parseInt(buy_amount, 10) > this.props.info.amount) {
      Toast.show(`You can buy only ${this.props.info.amount} tickets`);
      return;
    }
		try {
			const result = await stripe.paymentRequestWithCardForm();
			if (result && result.tokenId) {
				this.buyTicket(result.tokenId)
			}
		} catch (err) {
			Toast.show('An error occured. Please try again later');
		}
  }
  
  buyTicket = async (token) => {
		const { buy_amount } = this.state;
		const response = await buyOnMarketApi({ 
      token: token,
      market_id: this.props.info.id,
			amount: parseInt(buy_amount, 10)
		});
		if (response && response.data) {
      Toast.show('Success');
      this.props.getMyTickets();
      this.props.getMarketTickets();
      this.setState({ showBuyModal: false, buy_amount: ''})
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
	}
  
  renderBuyModal = () => {
		const { primaryColor, forthColor, sixthColor } = this.props.theme.palette;
    const { showBuyModal, buy_amount } = this.state;
    const { price } = this.props.info;
    const fee = price * 5 / 100;
		return (
			<Modal isVisible={showBuyModal} onBackdropPress={() => this.setState({showBuyModal: false})}>
				<View style={{backgroundColor: primaryColor, borderRadius: 10, padding: 20}}>
					<Text style={{color: 'white', textAlign: 'center', fontSize: 16, marginBottom: 20}}>Buy Ticket</Text>
					<TextInput
						style={{...CustomStyles.textInput, marginBottom: 10}}
						onChangeText={text => this.setState({buy_amount: text})}
						value={buy_amount}
						placeholder="Amount"
						keyboardType="number-pad"
						placeholderTextColor={forthColor}
						/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
            <Text style={[styles.tc, styles.t1]}>Subtotal</Text>
            <Text style={[styles.tc, styles.tb, styles.t1]}>${(price * parseInt(buy_amount ? buy_amount : 0, 10)).toFixed(2)}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.tc, styles.t1]}>Service fee</Text>
            <Text style={[styles.tc, styles.tb, styles.t1]}>${(fee * parseInt(buy_amount ? buy_amount : 0, 10)).toFixed(2)}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', borderTopColor: sixthColor, borderTopWidth: 1, marginTop: 15, paddingTop: 15}}>
            <Text style={[styles.tc, styles.t1]}>Total</Text>
            <Text style={[styles.tc, styles.tb, styles.t1]}>${((price + fee) * parseInt(buy_amount ? buy_amount : 0, 10)).toFixed(2)}</Text>
          </View>
					<View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 15}}>
            <TouchableOpacity onPress={() => this.gotoBuy()} style={[styles.roundBtn]}>
							<Image source={Images.CreditCard} style={{marginRight: 5}}/>
							<Text style={{ color: primaryColor}}>Credit Card</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		)
	}

  render() {
		const { primaryColor, secondaryColor } = this.props.theme.palette;
    const { ticket_info, amount, owner, user_id, price } = this.props.info;
    return (
      <View style={[CustomStyles.container, styles.ticketContainer, { backgroundColor: primaryColor }]}>
				<View style={{flex: 1, paddingRight: 25}}>
					<Text style={{color: secondaryColor, fontSize: 12}}>{moment(ticket_info.eventinfo.start_date).format('ddd, MMM D, YYYY h:m A')}</Text>
					<Text style={[styles.title, styles.thumbText, {marginTop: 5}]} numberOfLines={2} ellipsizeMode="tail">{ticket_info.eventinfo.title}</Text>
					<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]} numberOfLines={1} ellipsizeMode="tail">by {ticket_info.eventinfo.creator.first_name} {ticket_info.eventinfo.creator.last_name}</Text>
          <Text style={[styles.creator, styles.thumbText, {marginTop: 10}]} numberOfLines={1} ellipsizeMode="tail">Owner: {owner.first_name} {owner.last_name}</Text>
					<Text style={[styles.creator, styles.thumbText, {marginTop: 5}]} numberOfLines={1} ellipsizeMode="tail">Amount: {amount}</Text>
				</View>
				<View style={{alignItems: 'flex-end'}}>
          <Text style={{color: secondaryColor, fontSize: 15}}>${price}</Text>
					{this.props.me.id === user_id ? <TouchableOpacity style={{marginTop: 5}} onPress={() => this.backFromMarket()}>
						<Text style={{color: '#827AF3', fontSize: 13, textDecorationLine: 'underline'}}>Back from Market</Text>
					</TouchableOpacity> :
					<TouchableOpacity style={{marginTop: 10}} onPress={() => this.toggleBuyModal()}>
						<Text style={{color: secondaryColor, fontSize: 13, textDecorationLine: 'underline'}}>Buy Ticket</Text>
					</TouchableOpacity>}
				</View>
				{this.renderBuyModal()}
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
  },
  roundBtn: {
		width: 150,
		height: 44,
		borderRadius: 5,
		backgroundColor: '#E8F0FE',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
  },
  tc: {
		color: 'white'
	},
	tb: {
		fontWeight: 'bold'
	},
	t1: {
		fontSize: 14
	},
	t2: {
		fontSize: 16
	},
	t3: {
		fontSize: 18
	},
	t4: {
		fontSize: 24
	},
});

function mapStateToProps(state) {
  return {
    me: state.Auth.me || {},

  };
}

export default connect(mapStateToProps, { getMyTickets, getMarketTickets })(withTheme(MarketTicketThumb));
