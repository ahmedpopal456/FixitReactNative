import React, { useRef, useEffect, FunctionComponent } from 'react';
import { Animated } from 'react-native';
import { BottomTabHighlightsAnimatorProps } from '../models/animators/bottomTabHighlightsAnimatorProps';

const BottomTabHighlightsAnimator :
FunctionComponent<BottomTabHighlightsAnimatorProps> = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.focused) {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        },
      ).start();
    } else {
      Animated.timing(
        fadeAnim,
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
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default BottomTabHighlightsAnimator;
