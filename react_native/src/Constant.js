import { StyleSheet } from 'react-native';

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