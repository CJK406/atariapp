import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleProp, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Route } from '@react-navigation/native';

import { style, TAB_BAR_HEIGHT } from './style/bottom.tab.styles';
import FabBarButton, { BarButton } from './tabbarBtn';
import { getTabShape } from './tabshape';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const tabWidth = 110;

export const defaultSpringConfig = {
  damping: 30,
  mass: 0.7,
  stiffness: 250,
};


export const ArtoTabs = (props) => {
    const {
        state,
        descriptors,
        navigation,
        color,
        activeTintColor,
        inactiveTintColor,
        springConfig,
        bottomBarContainerStyle,
      } = props;

  const [{ width, height }, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const { bottom } = useSafeAreaInsets();
  const d = getTabShape(width, height, tabWidth, TAB_BAR_HEIGHT);

  const tabsWidthValue = React.useMemo(() => width / state.routes.length, [
    width,
    state.routes,
  ]);
  const tabsRealWidth = width / state.routes.length;

  const [animatedValueLength] = useState(
    new Animated.Value(-width + tabsWidthValue * state.index)
  );
  
  const offset =
    tabsRealWidth < tabWidth
      ? tabWidth - tabsRealWidth
      : (tabsRealWidth - tabWidth) * -1;

  useEffect(() => {
    const newValue = -width + tabsWidthValue * state.index;

    Animated.spring(animatedValueLength, {
      toValue: newValue - offset / 2,
      ...(springConfig || defaultSpringConfig),
      useNativeDriver: true,
    }).start();
  }, [width, height, state, tabsWidthValue, offset, animatedValueLength]);

  const [animationValueThreshold] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(animationValueThreshold, {
      toValue: state.index,
      ...(springConfig || defaultSpringConfig),
      useNativeDriver: true,
    }).start();
  }, [animationValueThreshold, state.index]);

  return (
    <View
      onLayout={({
        nativeEvent: {
          layout: { height: lHeight, width: lWidth },
        },
      }) => {
        setDimensions({ width: lWidth, height: lHeight });
      }}
      style={[
        style.container,
        {
          marginBottom: bottom,
          height: TAB_BAR_HEIGHT,
          backgroundColor:props.darkmode ?'rgb(33,33,33)' : 'white',
        },
        bottomBarContainerStyle,
      ]}
    >
      {bottom > 0 && (
        <View
          style={[
            {
              height: bottom,
              backgroundColor: color,
              bottom: bottom * -1,
            },
            style.bottomFill,
          ]}
        />
      )}
      <View style={style.fabButtonsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <FabBarButton
              key={route.key}
              options={options}
              onPress={onPress}
              onLongPress={onLongPress}
              index={index}
              isFocused={isFocused}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
            />
          );
        })}
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          { elevation: 11, zIndex: 0, backgroundColor: 'transparent' },
        ]}
      >
        <AnimatedSvg
          width={width * 2.5}
          height={height + bottom}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'transparent',
            transform: [{ translateX: animatedValueLength }],
          }}
        >
          <Path d={d} fill={props.darkmode ? 'rgb(3,3,3)': '#c42626'} />
        </AnimatedSvg>
      </View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <BarButton
            key={route.key}
            options={options}
            onPress={onPress}
            onLongPress={onLongPress}
            index={index}
            isFocused={isFocused}
            activeTintColor={activeTintColor}
            inactiveTintColor={inactiveTintColor}
          />
        );
      })}
    </View>
  );
};

//export default ArtoTabs;
function mapStateToProps(state) {
    return {
          darkmode:state.Auth.darkmode
    };
}
export default connect(mapStateToProps, { })(withTheme(ArtoTabs));