import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    alignCenter:{
		alignSelf:'center', 
		alignItems:'center'
	},
    topTabBar: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 3,
        height: 44, 
        marginLeft: -15, 
        marginRight: -15, 
        alignItems: 'center', 
        flexDirection: 'row'
	},
    topTab: {
		height: '100%',
		justifyContent: 'center',
		width: '16.66%'
	},
    activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#f7931a'
	},
    tabHeaderIcon:{
        width:25, 
        height:25, 
        alignItems:'center',
        alignSelf:'center'
    },
    // Trade Page Component
    balanceLabel:{
        fontSize:15,
        alignItems:'center',
        alignSelf:'center',
        marginTop:20
    },
    coinBalance:{
        fontSize:23,
        marginTop:20,
        alignSelf:'center'
    },
    usdBalance:{
        fontSize:20,
        marginTop:5,
        alignSelf:'center'
    },
    badgeRadius:{
        padding:5,
        borderRadius:20,
        marginLeft:10
    },
    cryptoPriceContainer:{
        flexDirection:'row',
        marginTop:10,
        alignSelf:'center',
        alignItems:'center'
    },
    
    //MODAL
    modalContainer:{
        borderRadius:10,
        top:'30%',
        width:'100%',
        margin:0,
        borderTopRightRadius:50,
        borderTopLeftRadius:50
    },
    icSend:{
        width:25,
        height:25,
        marginTop:20,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    modalTitle:{
        fontSize:30,
        textAlign:'center',
        marginTop:10,
        marginBottom:20
    }
})