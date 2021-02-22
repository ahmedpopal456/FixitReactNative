import React, { useRef, useEffect, FunctionComponent } from 'react';
import { Animated } from 'react-native';

const BottomTabIconAnimator : FunctionComponent = (props) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.focused) {
      Animated.timing(
        scaleAnim,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        },
      ).start();
    } else {
      Animated.timing(
        scaleAnim,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        },
      ).start();
    }
  }, [props.focused]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [
          {
            scaleX: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2],
            }),
          },
          {
            scaleY: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2],
            }),
          },
        ],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default BottomTabIconAnimator;
