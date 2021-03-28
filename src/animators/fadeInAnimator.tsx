import React from 'react';

import { Animated, TextStyle } from 'react-native';

type FadeInAnimatorProps = {
  visible: boolean,
  style?:TextStyle & React.CSSProperties
};

class FadeInAnimator extends React.Component<FadeInAnimatorProps> {
  visibility: Animated.Value;

  state={
    visible: false,
  }

  constructor(props:FadeInAnimatorProps) {
    super(props);
    this.state = {
      visible: props.visible,
    };
    this.visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  componentDidUpdate(prevProps:FadeInAnimatorProps) : void {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
      Animated.timing(this.visibility, {
        toValue: this.props.visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ visible: this.props.visible });
      });
    }
  }

  render() : JSX.Element {
    const containerStyle = {
      opacity: this.visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this.visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1],
          }),
        },
      ],
      ...this.props.style,
    };

    return (
      <Animated.View style={containerStyle}>
        {this.state.visible ? this.props.children : null}
      </Animated.View>
    );
  }
}

export default FadeInAnimator;
