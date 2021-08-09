import { StyleSheet } from 'react-native';
import { Images } from './Assets';
export const CustomStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	innerContainer: {
		justifyContent: 'center',
		padding: 15,
		position: 'relative'
	},
	buttonStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		fontWeight: 'bold'
	},
	longBtn: {
		width: '100%'
	},
	smallBtn: {
		width: 186,
		height: 46
	},
	textInput: {
		height: 44,
		borderWidth: 1,
		borderColor: '#7070701f',
		width: '100%',
		backgroundColor: '#23262C',
		paddingLeft: 16,
		color: '#7882A2',
		fontSize: 12
	},
	topBanner: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0
	},
	centerItem: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	d_back:{
		backgroundColor:'black',
	},
	w_back:{
		backgroundColor:'white'
	},
	d_text:{
		color:'white',
	},
	w_text:{
		color:'black',
	},


});

export const STRIPE_KEY = 'pk_test_zGTST6gDIDz7PxiSF6tc1vmG00lHgZqsEu';
export const GOOGLE_API_KEY = 'AIzaSyAm-gRSVrsjGjc00jQSkNDVKIzxU8SlkSM';
export const PAYPAL_CLIENT = 'ARHm04t5sDvIMQXlvT4wXU__A2LGmAITVa7M666dqKnzQSGiGXlKm_X8e18G4HUsuenHmZfmsbj-oSLe';

export const Headers = [{Image:Images.Atri_icon,qr_image:Images.Atri_qr_icon, text:'ATRI',color:'#ce2424',full_text:'atri',graph_text:'atari',history_t:'ATARI'},
{Image:Images.Eth_icon,qr_image:Images.Eth_qr_icon,text:'ETH',color:'aqua',full_text:'ethereum',graph_text:'ethereum',history_t:'ETH'},
{Image:Images.bch_icon,qr_image:Images.bch_qr_icon,text:'USDT',color:'rgb(80,175,149)',full_text:'USDT',graph_text:'tether',history_t:'USDT'},	
{Image:Images.btc_icon,qr_image:Images.btc_qr_icon,text:'BTC',color:'#f7931a',full_text:'bitcoin',graph_text:'bitcoin',history_t:'BTC'},
{Image:Images.bnb_icon,qr_image:Images.bnb_qr_icon,text:'BNB',color:'rgb(243,186,46)',full_text:'Binance Coin',graph_text:'binancecoin',history_t:'BNB'},
{Image:Images.Ltc_icon,qr_image:Images.Ltc_qr_icon,text:'LTC',color:'#345c9c',full_text:'litecoin',graph_text:'litecoin',history_t:'LTC'},
];

export const CryptoStyle = {
	btc : {
		color:'#f7931a',
		decimal:8
	},
	atri : {
		color:'#c42626',
		decimal:0
	},
	atari : {
		color:'#c42626',
		decimal:0
	},
	eth : {
		color:'aqua',
		decimal:8
	},
	ltc : {
		color:'#345c9c',
		decimal:8
	},
	usdt : {
		color:'rgb(80,175,149)',
		decimal:6
	},
	ftm : {
		color:'rgb(19,181,236)',
		decimal:8
	},
	bnb : {
		color:'rgb(243,186,46)',
		decimal:8
	}
}