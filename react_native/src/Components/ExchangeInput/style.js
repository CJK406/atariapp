import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container:{
        marginTop:20
    },
    label:{
        fontSize:14,
        marginBottom:20
    },
    row:{
        flexDirection:'row'
    },
    inputField:{
        width:'38%',
        height:50,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'black'
    },
    iconContainer:{
        width:'12%', 
        backgroundColor:'white', 
        alignSelf:'center', 
        alignItems:'center', 
        borderWidth:0.5, 
        borderColor:'black',
        height:50
    },
    centerIcon:{
        width:30,
        height:30,
        alignItems:'center',
        alignSelf:'center', 
        marginTop:10
    }
})