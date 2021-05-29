import { Icon } from 'fixit-common-ui';
import React from 'react';
import {
  Text, View,
} from 'react-native';

export default class RatingsSlider extends React.Component<{score:number}> {
  calculateCaretOffset = () : number => (this.props.score * 135) / 100

  calculateCaretColor = () : string => {
    if (this.props.score <= 33.3) {
      return '#D4675A';
    } if (this.props.score <= 50) {
      return '#E58346';
    } if (this.props.score <= 66) {
      return '#F5D23E';
    } if (this.props.score <= 84) {
      return '#5690FA';
    }
    return '#8ED698';
  }

  render() : JSX.Element {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: -15,
        marginBottom: 20,
      }}>
        <View>
          <Icon
            library={'FontAwesome5'}
            name={'caret-down'}
            size={15}
            style={{
              marginLeft: this.calculateCaretOffset(),
              color: this.calculateCaretColor(),
            }} />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <View style={{
              height: 4,
              width: 45,
              backgroundColor: '#D4675A',
              borderRadius: 2,
            }}></View>
            <View style={{
              height: 4,
              width: 30,
              backgroundColor: '#E58346',
              borderRadius: 2,
              marginLeft: -2,
            }}></View>
            <View style={{
              height: 4,
              width: 25,
              backgroundColor: '#F5D23E',
              borderRadius: 2,
              marginLeft: -2,
            }}></View>
            <View style={{
              height: 4,
              width: 25,
              backgroundColor: '#5690FA',
              borderRadius: 2,
              marginLeft: -2,
            }}></View>
            <View style={{
              height: 4,
              width: 25,
              backgroundColor: '#8ED698',
              borderRadius: 2,
              marginLeft: -2,
            }}></View>
          </View>
        </View>
        <Text style={{
          marginTop: 8,
          marginLeft: 10,
        }}>{this.props.score}</Text>
      </View>
    );
  }
}
