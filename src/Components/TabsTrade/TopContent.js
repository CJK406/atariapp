import React, { useEffect, useState} from 'react'
import {View, Text,Image,TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-material-ui'
import Modal from 'react-native-modal'
import styles from './style'
import {SideTrade} from '../index'
import {CryptoStyle} from '../../Constant'
import { Images } from '../../Assets';

import Receive from './Receive'
import Send from './Send'
const TopContent = (props) => {
    const [cryptoBalance, setCryptoBalance] = useState(0)
    const [usdBalance, setUsdBalance] = useState(0)
    const [currPrice, setCurrPrice] = useState(0)
    const [changes, setChanges] = useState('0.00')
    const [comingshowmodal, setShowComingModal] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState(0)
    const { tabData } = props 
    const txtColor  = props.darkmode ? 'white':'black'
    const currency = tabData.text
    const curr_key = currency.toLowerCase()
    const cryptoColor = CryptoStyle[curr_key]['color']
    const {chart_data,balance, price,currentTab} = props
    const {decimal} = CryptoStyle[curr_key]
    const unsetData = () => {
        setCryptoBalance(0)
        setUsdBalance(0)
        setChanges('0.00')
    }
    const setData = () => {
        setCryptoBalance(balance[curr_key].toFixed(decimal))
        const usdkey = curr_key+"_usd"
        setUsdBalance(balance[usdkey].toFixed(2))
        setCurrPrice(parseFloat(price[curr_key]).toFixed(2)) 
    }
    const calculateChanges = () => {
        let changes = '0.00'
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
                    <Text style={{color:txtColor,...styles.coinBalance}}>{ balance[curr_key].toFixed(decimal) } {currency}</Text>
                    <Text style={{color:txtColor,...styles.usdBalance}}>${ commafy(balance[curr_key+"_usd"].toFixed(2)) }</Text>
                </View>
                {currency !== 'BCH' &&
                <SideTrade label={'Send'} icon={'trending-up-outline'} position={'right'}
                    onPress={() => showModalComponent(1)}/>}
            </View>
            <View style={styles.cryptoPriceContainer}>
                <Text style={{color:cryptoColor,fontSize:19}}>{currency} ${chart_data.y[chart_data.y.length-1]}</Text>
                <View style={{backgroundColor:cryptoColor,...styles.badgeRadius}}>
                    <Text style={{fontWeight:'700'}}>{chart_data.percent.toFixed(2)}%</Text>
                </View>
            </View>
            <Modal isVisible={showModal} style={{margin:0}}
                onBackdropPress={() => setShowModal(false)}>
                    {renderModal()}
            </Modal>
            <Modal
					isVisible={comingshowmodal}
					>
					<View style={{ backgroundColor:'white',borderRadius:10}}>
						<Image source={Images.exchange_gif} style={{justifyContent:'center', width:'100%',height:200,marginTop:40}} />
						<Text style={{fontSize:30, textAlign:'center',marginTop:40,marginBottom:20}}>Available Soon</Text>
						<Text style={{textAlign:'center',padding:20,fontSize:20}}>This feature will be available soon.</Text>
						<TouchableOpacity onPress={() => {setShowComingModal(false)}} 
							style={{backgroundColor:'rgb(227,30,45)', width:'60%',marginBottom:20,textAlign:'center',justifyContent:'center',marginLeft:'18%',padding:20,borderRadius:10,textAlign:'center',justifyContent:'center'}}
						>
							<Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>OK</Text>
						</TouchableOpacity>
					</View>
				</Modal>
        </View>
    )
}

function mapStateToProps(state) {
    return {
          darkmode: state.Auth.darkmode,
          get_address:state.Auth.get_address,
          price:state.Auth.price,
    };
  }
  
  export default connect(mapStateToProps, {  })(withTheme(TopContent));