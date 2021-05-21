import {StyleSheet, Dimensions} from 'react-native'

const {width, height} = Dimensions.get('window')

export default StyleSheet.create({
    container:{
        marginTop: 10,
        width: width * 0.64,
        opacity: 1,
        borderRadius: 500,
        borderColor: 'white',
        borderWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input : {
        width: width * 0.5,
        height: 40,
        color:"white"
    },
    container2: {
        marginTop: 30,
        width: width * 0.7,
        opacity: 1,
        borderRadius: 500,
        borderColor: 'white',
        borderWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,.6)'
      }
})