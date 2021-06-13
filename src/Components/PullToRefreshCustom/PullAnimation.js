import React from "react";
import {Animated, UIManager, ViewStyle} from "react-native";

class PullAnimation extends React.Component{
    constructor(props){
        super(props)
    }

    componentDidUpdate(prev, next){
      
    }

    render(){
        const {scrollY, minPullDistance, yValues, styleProps} = this.props
        return(
            <Animated.View
                style={[
                styleProps,
                {
                    top: scrollY.interpolate({
                    inputRange: [-minPullDistance, 0],
                    outputRange: [yValues.to || yValues.to === 0 ? yValues.to : yValues.from, yValues.from],
                    extrapolate: "clamp",
                    }),
                    position: "absolute",
                },
                ]}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}

export default PullAnimation;