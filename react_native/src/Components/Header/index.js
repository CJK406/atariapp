import React from 'react'
import {View, Image} from 'react-native'
import { Images } from '../../Assets'
import LogoBox from '../LogoBox'
import styles from './style'
import { CustomStyles } from '../../Constant';

const Header = ({darkmode}) => {
    const bg = darkmode ? CustomStyles.d_back : CustomStyles.w_back
    return(
        <View style={{...bg,...styles.container}}>
            <LogoBox style={{ position: 'absolute', left: 0 }} />
            <Image source={Images.Logo} style={styles.logo} />
        </View>
    )
}

export default Header