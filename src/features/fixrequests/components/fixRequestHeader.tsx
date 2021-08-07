import { colors, H1 } from 'fixit-common-ui';
import React from 'react';
import {
  View, Image, TouchableOpacity,
} from 'react-native';
import backArrowIcon from '../../../common/assets/back-icon.png';

export default class FixRequestHeader extends
  React.Component<{
    showBackBtn:boolean,
    navigation:any,
    screenTitle:string,
    textHeight:number,
    backFunction?:()=>void
  }> {
    handleGoBack = () : void => {
      if (this.props.backFunction) {
        this.props.backFunction();
      } else if (this.props.navigation.canGoBack()) {
        this.props.navigation.goBack();
      }
    }

    render() : JSX.Element {
      return (
        <>
          <View style={{
            backgroundColor: colors.accent,
            padding: 20,
            paddingTop: 60,
            paddingBottom: 40,
            flex: 0,
            flexDirection: 'column',
            alignItems: 'flex-start',
            shadowColor: '#000',
            zIndex: 1,
            elevation: 1,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,
          }}>
            {this.props.showBackBtn ? (
              <TouchableOpacity style={{
                position: 'absolute',
                top: 20,
                left: 20,
              }}
              onPress={this.handleGoBack}>
                <Image source={backArrowIcon} />
              </TouchableOpacity>
            ) : null}
            <View style={{
              height: this.props.textHeight,
            }}>
              <H1>{this.props.screenTitle}</H1>
            </View>
          </View>
        </>
      );
    }
}
