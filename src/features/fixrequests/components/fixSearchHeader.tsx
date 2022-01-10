import { StackNavigationProp } from '@react-navigation/stack';
import { H1 } from 'fixit-common-ui';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import backArrowIcon from '../../../common/assets/back-icon.png';

export default class FixSearchHeader extends React.Component<{
  showBackBtn: boolean;
  navigation: StackNavigationProp<HomeStackNavigatorProps, keyof HomeStackNavigatorProps>;
  screenTitle: string;
}> {
  handleGoBack = (): void => {
    if (this.props.navigation.canGoBack()) {
      this.props.navigation.goBack();
    }
  };

  render(): JSX.Element {
    return (
      <>
        <View
          style={{
            backgroundColor: '#EEEEEE',
            padding: 10,
            paddingTop: 60,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flex: 0,
            flexDirection: 'column',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
          {this.props.showBackBtn ? (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
              }}
              onPress={this.handleGoBack}>
              <Image source={backArrowIcon} />
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              padding: 20,
              margin: 10,
              borderRadius: 8,
              backgroundColor: '#333',
            }}>
            <Text
              style={{
                color: '#fff',
              }}>
              Search bar goes here
            </Text>
          </View>
          <View
            style={{
              height: 40,
            }}>
            <H1>{this.props.screenTitle}</H1>
          </View>
        </View>
      </>
    );
  }
}
