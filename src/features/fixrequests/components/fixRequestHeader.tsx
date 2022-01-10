import { colors, H1 } from 'fixit-common-ui';
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import backArrowIcon from '../../../common/assets/back-icon.png';

export default class FixRequestHeader extends React.Component<{
  showBackBtn: boolean;
  navigation: any;
  screenTitle: string;
  textHeight: number;
  backFunction?: () => void;
}> {
  handleGoBack = (): void => {
    if (this.props.backFunction) {
      this.props.backFunction();
    } else if (this.props.navigation.canGoBack()) {
      this.props.navigation.goBack();
    }
  };

  render(): JSX.Element {
    return (
      <>
        <View
          style={{
            backgroundColor: colors.accent,
            paddingLeft: 20,
            paddingBottom: 40,
            paddingTop: 20,
            flexDirection: 'row',
            alignItems: 'flex-start',
            shadowColor: '#000',
          }}>
          {this.props.showBackBtn ? (
            <TouchableOpacity style={{ padding: 3 }} onPress={this.handleGoBack}>
              <Image source={backArrowIcon} />
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              height: this.props.textHeight,
              paddingLeft: 15,
              width: '80%',
            }}>
            <H1>{this.props.screenTitle}</H1>
          </View>
        </View>
      </>
    );
  }
}
