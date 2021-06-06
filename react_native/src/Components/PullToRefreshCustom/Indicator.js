import React from 'react'
import {View, Image, Animated, ActivityIndicator} from 'react-native'
import PropTypes from 'prop-types'
import styles from './style'

const Icon = require('../../Assets/atri.png');

export default class Indicator extends React.Component{
    render () {
        var display_object = ''
        if (this.props.needPull) {
            display_object = (
            <Image source={Icon} style={{width: 36, height: 36}}/>
            )
        } else {
            display_object = (
            <ActivityIndicator
                size='large'
            />
            )
        }
        return (
            <View style={styles.IndicatorWrap}>
            {display_object}
            </View>
        )
    }
}

Indicator.propTypes = {
    needPull: PropTypes.bool
}