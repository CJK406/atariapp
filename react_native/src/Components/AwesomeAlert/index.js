import React from 'react'
import {View, Text, TouchableOpacity, Animated, Modal} from 'react-native'
import LottieFiles from 'lottie-react-native'
import styles from './styles'

const _success = require('../../Assets/animation/success-anim.json');
const _warning = require('../../Assets/animation/warning-anim.json');
const _error = require('../../Assets/animation/error-anim.json');

class AwesomeAlert extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            showIcon:false,
            lottieAnim:_success,
            title:null,
            message : null,
            close_bg : null
        }
        this.springValue = new Animated.Value(0.3)
        this.hideAlert = this.hideAlert.bind(this); 
        this.onBackdropPress = this.onBackdropPress.bind(this);

        this._color={
            success:'#28a745',
            warning:'#343a40',
            error : '#dc3545'
        }
    }

    showAlert(type="success", title, message ){
        const _anim = _lottieAnim(type);

        if(!_anim) throw "Undefined type of alert {success|warning|error}!"

        const close_bg = this._color[type];
        this.setState({
            show:true,
            lottieAnim : _anim,
            title,
            message,
            close_bg
        })

        Animated.spring(this.springValue, {
            toValue: 1,
            bounciness: 10,
            useNativeDriver:true,
          }).start(() => {
              this.setState({showIcon:true})
          });
    }

    hideAlert(){
        
        Animated.spring(this.springValue, {
            toValue: 0,
            tension: 10,
            useNativeDriver:true,
        }).start(() => {
            
        });
        setTimeout(() => {
            this.setState({
                show:false,
                showIcon:false
            })
        }, 70);
        
    }

    onBackdropPress(){
        if(!this.props.static) this.hideAlert();
    }

    _renderModal() {
        const {lottieAnim, title, message, close_bg} = this.state
        return(
            <View style={[styles.container]}>
                <Animated.View style={[styles.contentContainer, {transform: [{ scale: this.springValue }]}]}>
                     <LottieFiles
                        loop={false}
                        style={{ width: 100, height: 100, }}
                        source={lottieAnim}
                        autoSize
                        resizeMode={'cover'}
                        autoPlay />
                  
                    {title && <Text style={[styles.title]}>{title}</Text> }
                    {message &&  <Text style={[styles.message]}>{message}</Text> }
                    <View style={{alignItems:"center", marginVertical:10, marginTop:20}}>
                        <TouchableOpacity activeOpacity={.6} onPress={this.hideAlert} style={{ backgroundColor:close_bg, borderRadius:5, paddingHorizontal:10, minWidth:'60%', paddingVertical:5 }}>
                            <Text style={{color:"#fff", textAlign:"center"}}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                    
                </Animated.View>
            </View>
        )
    }

    render(){
        const {show} = this.state
        return(<Modal
          animationType="none"
          transparent={true}
          visible={show}
          onRequestClose={this.hideAlert}
        >
            <TouchableOpacity activeOpacity={1} onPress={this.onBackdropPress} 
                style={{flex: 1, alignItems: 'center', justifyContent: 'center', 
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width:"100%",
                    top:0,
                    bottom:0,
                    position:"absolute",
                    }}>
                
            </TouchableOpacity>
            {this._renderModal()}
        </Modal>)
    }
}

const _lottieAnim = (type="success") => {
    switch (type) {
        case "success":
            return _success
        case "warning":
            return _warning
        case "error":
            return _error
        default:
            return null;
    }
}


export default AwesomeAlert