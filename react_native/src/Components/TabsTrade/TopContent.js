import React, { useEffect, useState } from 'react'
import {View, Text} from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-material-ui'
import Modal from 'react-native-modal'
import styles from './style'
import {SideTrade} from '../index'
import {CryptoStyle} from '../../Constant'
import Receive from './Receive'
import Send from './Send'


const TopContent = (props) => {
    const [cryptoBalance, setCryptoBalance] = useState(0)
    const [usdBalance, setUsdBalance] = useState(0)
    const [currPrice, setCurrPrice] = useState(0)
    const [changes, setChanges] = useState('0.00')
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState(0)
    
    const { tabData } = props 
    const txtColor  = props.darkmode ? 'white':'black'
    
    const currency = tabData.text
    const curr_key = currency.toLowerCase()

    const cryptoColor = CryptoStyle[curr_key]['color']

    const unsetData = () => {
        setCryptoBalance(0)
        setUsdBalance(0)
        // setCurrPrice(0)
        setChanges('0.00')
    }

    const setData = () => {
        const {balance, price} = props
        const {decimal} = CryptoStyle[curr_key]
        setCryptoBalance(balance[curr_key].toFixed(decimal))

        const usdkey = curr_key+"_usd"
        setUsdBalance(balance[usdkey].toFixed(2))
        setCurrPrice(price[curr_key].toFixed(2)) 
        
    }

    const calculateChanges = () => {
        
        let changes = '0.00'
        const {chart_data} = props
        if(chart_data.y.length>0){
            const openPrice = chart_data.y[0]
            const closePrice = chart_data.y[chart_data.y.length-1];
            changes = ((closePrice-openPrice)/openPrice*100).toFixed(2)
        }

        setChanges(changes)
    }

    useEffect(() => {
        setChanges('0.00')
        unsetData()
        return setData()
    },[props.tabData])

    useEffect(() => {
        calculateChanges()
    },[props.chart_data])

    useEffect(() => {
        unsetData()
        return setData()
    },[])

    const showModalComponent = (mode) => {
        setModalMode(mode)
        setShowModal(true)
    }

    const ListsContent = [
        {
            component:Receive,
            params : {
                    address : props.get_address[curr_key],
                    darkmode: props.darkmode,
                    icon : tabData.Image,
                    crypto_name:tabData.full_text,
                    color: tabData.color,
            }
        },{
            component:Send,
            params : {
                darkmode:props.darkmode,
                tabData : tabData,
                cryptoBalance: cryptoBalance,
                usdBalance:usdBalance,
                price:currPrice,
                closeModal:() => {
                    setShowModal(false)
                }
            }
        }]

    const renderModal= () => {
        const _render = ListsContent[modalMode]
        const ContentModal = _render.component

        return <ContentModal {..._render.params}/>
    }
    function commafy( num ) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
     }
    return(
        <View >
            <Text style={{color:txtColor, ...styles.balanceLabel}}>Current Balance</Text>
            <View style={{flexDirection:'row'}}>
                {currency !== 'BCH' &&
                <SideTrade label={'Receive'} icon={'trending-down-outline'} position={'left'}
                    onPress={() => showModalComponent(0)}
                />}
                <View style={{flex:1}}>
                    <Text style={{color:txtColor,...styles.coinBalance}}>{ cryptoBalance } {currency}</Text>
                    <Text style={{color:txtColor,...styles.usdBalance}}>${ commafy(usdBalance) }</Text>
                </View>
                {currency !== 'BCH' &&
                <SideTrade label={'Send'} icon={'trending-up-outline'} position={'right'}
                    onPress={() => showModalComponent(1)}/>}
                
            </View>
            <View style={styles.cryptoPriceContainer}>
                <Text style={{color:cryptoColor,fontSize:19}}>{currency} ${commafy(currPrice)}</Text>
                <View style={{backgroundColor:cryptoColor,...styles.badgeRadius}}>
                    <Text style={{fontWeight:'700'}}>{changes}%</Text>
                </View>
            </View>
            
            <Modal isVisible={showModal} style={{margin:0}}
                onBackdropPress={() => setShowModal(false)}>
                    {renderModal()}
            </Modal>
            
        </View>
    )
}

function mapStateToProps(state) {
    return {
          balance: state.Auth.balance,
          darkmode: state.Auth.darkmode,
          get_address:state.Auth.get_address,
          price:state.Auth.price,
    };
  }
  
  export default connect(mapStateToProps, {  })(withTheme(TopContent));