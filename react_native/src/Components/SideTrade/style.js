import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container:{
        backgroundColor:'#ce2424',
        height:48,
        marginTop:40,
        paddingTop:5,
    },
    rightRadius :{
        borderTopRightRadius:100,
        borderBottomRightRadius:100,
        paddingLeft:5, 
    },
    leftRadius:{
        borderTopLeftRadius:100,
        borderBottomLeftRadius:100, 
        alignItems:'flex-end',
        paddingRight:5
    },
    labelStyle:{
        fontSize:12,
        color:'white'
    }
})