import React from 'react'
import {View, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import styles from './style'

class InputLogin extends React.Component{
    constructor(props){ 
        super(props)
    }
    
    render(){
        return(
            <View style={this.props.mode ? styles.container2 : styles.container}>
                <View style={{width: '10%'}} />
                <View style={{width: '90%'}}>
                    <TextInput
                        ref={this.props.inputReff}
                        style={styles.input}
                        placeholderTextColor="#fff"
                        {...this.props}
                    />
                </View>
            </View>
        )
    }
}

InputLogin.propTypes = {
    mode:PropTypes.number,
    inputRef:PropTypes.func
}

InputLogin.defaultProps = {
    mode:0, //0 login; 1: register
    inputReff : () => {}
}

export default InputLogin;