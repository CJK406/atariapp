import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container:{
        // backgroundColor: 'rgb(66,66,66)', 
        marginBottom: 25, 
        padding:25,
        borderRadius:15, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    childBox:{
        flexDirection: 'row', 
        alignItems: 'center', 
        position: 'relative'
    },
    title:{
        color: 'white', 
        marginLeft: 10, 
        fontSize: 15
    },
    subTitle:{
        color: 'white', 
        marginLeft: 10, 
        fontSize: 10,
        color:'#a7a7a7'
    }
})