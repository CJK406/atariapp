import React from 'react'
import PropTypes from 'prop-types'
import { View, RefreshControl, ScrollView, Dimensions, Text, Animated, Image, Easing } from 'react-native'
import PullAnimation from './PullAnimation'
import Indicator from './Indicator'

const Icon = require('../../Assets/atri.png');
const height = Dimensions.get('window').height-70;

export default class PTRView extends React.Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      isScrollFree:true,
      minHeight:0,
      minPullDistance:70,
      layoutScrollHeight:0,
      refreshHeight:70,
      isRefreshing:false,
      spinValue:0,
      shouldTriggerRefresh:false,
      disabled:false,
      ef:null
    }

    this.scrollRef = null
    this.scrollY = new Animated.Value(0);
    this.indicatorAnim = new Animated.Value(-50);
    this.spinAnim = new Animated.Value(0);
    
  }

  setMinHeight(height){
    this.setState({minHeight:height})
  }

  _onLayout(e){
    const {refreshHeight} = this.state
    const layoutHeight = e.nativeEvent.layout.height > height ? e.nativeEvent.layout.height : height;
    this.setMinHeight(layoutHeight + refreshHeight);
  }

  _onScrollEvent(e){
    const {minPullDistance, layoutScrollHeight, refreshHeight, shouldTriggerRefresh} = this.state
    
    if (e.nativeEvent.velocity.y <= 0) { 
      const scrollable = layoutScrollHeight > height ? layoutScrollHeight:height
      const minHeight = scrollable + minPullDistance;
      this.setState({
        minHeight,
        refreshHeight:minPullDistance 
      }) 
    }
   // onScroll && onScroll(e);
    this.scrollY.setValue(minPullDistance - e.nativeEvent.contentOffset.y);
    const distance = this.scrollY;
    if(e.nativeEvent.contentOffset.y >= 70 && !this.state.ef){
      this.setState({
        ef:e.nativeEvent.contentOffset.y
      })
    }

    if(e.nativeEvent.contentOffset.y === 70){
      if(this.state.ef){
        
      }
    }

   if(e.nativeEvent.contentOffset.y < 70){
 
      if ((minPullDistance - e.nativeEvent.contentOffset.y) >= 68) {
        
        if (!shouldTriggerRefresh) {
          this.setState({
            shouldTriggerRefresh:true
          })
        }
      }

      if(!shouldTriggerRefresh ){
        this._indicatorShow(e.nativeEvent.contentOffset.y); 
      }
    }
      
    
  }

  componentDidUpdate(nextProps, prevState){
    if(!prevState.shouldTriggerRefresh && this.state.shouldTriggerRefresh){
      Animated.spring(this.indicatorAnim, {
        toValue:100,
        friction: 10,
        useNativeDriver:false
      }).start();

      
    }
   
  }

  _indicatorShow(yOffset){
    if(this.state.shouldTriggerRefresh) return;
    Animated.spring(this.indicatorAnim, {
      toValue:Math.abs(yOffset-70),
      friction: 10,
      useNativeDriver:false
    }).start();

    Animated.spring(this.spinAnim, {
      toValue:Math.abs(yOffset-70),
      friction: 10,
      useNativeDriver:false
    }).start();
  }

  _indicatorHide(){
    
    Animated.spring(this.indicatorAnim, {
      toValue:-50,
      friction: 10,
      useNativeDriver:false
    }).start(
      this.setState({
        isRefreshing:false
      })
    );
  }

  componentDidMount(){
    
    this.scrollRef.scrollTo({y: 70}); 
    this._indicatorHide();
  
  }

  _delay () {
    return new Promise((resolve) => {
      setTimeout(resolve, 3000)
    })
  }

  _handleOnRefresh () {

    return new Promise((resolve) => {
      Promise.all([
        this.props.onRefresh(resolve),
        this._delay()
      ])
        .then(() => {
         
          this._indicatorHide();
          this.setState({
            shouldTriggerRefresh:false
          })
          
        })
    })
  }

  _onMomentumScrollEnd(e){
    
   
    
      if (e.nativeEvent.contentOffset.y < 70) {
        this.scrollRef.scrollTo({y: this.state.refreshHeight});
        if(!this.state.shouldTriggerRefresh){
          
          this._indicatorHide();
        }else{
          if(!this.state.isRefreshing){
            this.setState({
              isRefreshing:true
            })
            this.startLoadingAnim();
            this._handleOnRefresh(); 
          }
        }
      }
      
   
    
  }

  _onScrollEndDrag(e){
    const {shouldTriggerRefresh,isRefreshing} = this.state
    
    if(shouldTriggerRefresh && !isRefreshing){
      const dstance = this.scrollY._value;
      
      if(dstance >= 68 && !isRefreshing){ 
        this.setState({
          isRefreshing:true
        })
        this.startLoadingAnim();
        this._handleOnRefresh(); 
      }else{
        
        this._indicatorHide();
      }
    }else{
      if(!isRefreshing){
        this._indicatorHide();
      }
    }
   
  }

  startLoadingAnim () {
   
    this.spinAnim.setValue(0)
    Animated.timing(
      this.spinAnim,
      {
        toValue:70,
        duration: 800,
        useNativeDriver:false, 
        easing: Easing.linear,
      }
    ).start(() => {
      if(this.state.shouldTriggerRefresh) 
        this.startLoadingAnim();
    })
  }

  _renderLoader(){
    
    return (
      <Animated.View style={{
        position:'absolute',
        top:this.indicatorAnim,
        width:35,
        height:35,
        alignSelf:"center",
        backgroundColor:"#fff",
        borderRadius:50,
        elevation:15,
        alignItems:"center",
        justifyContent:"center"
        //transform:[{scale:this.indicatorAnim}]
      }}>
        <Animated.Image source={Icon} style={{width:20, height:20, 
          transform:[{
            rotate:this.spinAnim.interpolate({
              inputRange: [0, 70],
              outputRange: ['0deg', '360deg'],
            }),
          }]
        }}/>
      </Animated.View>
    )
  }
  
  render () {
    const  {isScrollFree, minHeight, refreshHeight, minPullDistance} = this.state
    
    return ( 
      <View style={[{flex:1}, this.props.style]}>
       
        <ScrollView
          ref={(rf) => this.scrollRef = rf}
          contentContainerStyle={{minHeight}} 
          scrollEnabled={isScrollFree}  
          onScroll={this._onScrollEvent.bind(this)} 
          onLayout={this._onLayout.bind(this)} 
          onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)} 
         
         onScrollEndDrag={this._onScrollEndDrag.bind(this)}
        >
          <View>
          {this._renderLoader()}
          <View style={{ minHeight:refreshHeight }}>
          
            <PullAnimation 
              minPullDistance={minPullDistance}
              yValues={{from: -50, to: 10}}
              styleProps={{height: 70}}
              scrollY={ this.scrollY.interpolate({
                inputRange: [0, minPullDistance],
                outputRange: [0, -minPullDistance],
              })}
            >
              
            </PullAnimation>
            
          </View>
          {this.props.children} 
          </View>
        </ScrollView>
      </View>
    )
  }
}

PTRView.defaultProps = {
  colors: ['#000'],
  progressBackgroundColor: '#fff',
  offset: 0,
  delay: 0
}

PTRView.propTypes = {
  delay: PropTypes.number,
  onRefresh: PropTypes.func,
  style: PropTypes.object,
  children (props, propName, componentName) {
  }
}