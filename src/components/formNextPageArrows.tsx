import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors, Icon } from 'fixit-common-ui';
import FadeInAnimator from '../animators/fadeInAnimator';

type clickOptionsModel =
    {
        label:string,
        onClick():void,
    }[]

export default class FormNextPageArrows extends
  React.Component<{mainClick?:() => void, secondaryClickOptions?:clickOptionsModel}> {
    state={
      showNextStepsOptions: false,
    }

    showNextStepsOptions = () : void => {
      this.setState({ showNextStepsOptions: !this.state.showNextStepsOptions });
    }

    handleMainClick = () : void => {
      this.showNextStepsOptions();
      if (this.props.mainClick) {
        this.props.mainClick();
      }
    }

    handleClickOption = (clickOption : () => void) : void => {
      this.showNextStepsOptions();
      clickOption();
    }

    render() : JSX.Element {
      return (
        this.props.secondaryClickOptions
          ? <>
            <FadeInAnimator visible={this.state.showNextStepsOptions}
              style={{
                position: 'absolute',
                bottom: 70,
                right: 20,
                zIndex: 3,
                elevation: 3,
                flexGrow: 0,
                alignItems: 'flex-end',
              }}
            >
              {this.props.secondaryClickOptions.map((clickOption:{
                label:string,
                onClick: () => void
              }) => (
                <TouchableOpacity key={clickOption.label}
                  testID='fixTemplateNextBtn'
                  style={{
                    padding: 8,
                    marginTop: 10,
                    borderRadius: 8,
                    backgroundColor: colors.dark,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexGrow: 0,
                  }}
                  onPress={() => this.handleClickOption(clickOption.onClick)}>
                  <Text style={{
                    marginRight: 10,
                    marginBottom: 2,
                    color: colors.accent,
                  }}>{clickOption.label}</Text>
                  <Icon library="FontAwesome5" name="arrow-right" color={'accent'} size={20}/>
                </TouchableOpacity>
              ))}
            </FadeInAnimator>
            <TouchableOpacity style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              zIndex: 3,
              elevation: 3,
              paddingTop: 7,
              paddingLeft: 10,
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: colors.primary,
            }}
            testID='fixTemplateNextOptionsBtn'
            onPress={this.showNextStepsOptions}>
              <Icon library="FontAwesome5" name="arrow-right" color={'accent'} />
            </TouchableOpacity>
          </>
          : <TouchableOpacity style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 3,
            elevation: 3,
            paddingTop: 7,
            paddingLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 100,
            backgroundColor: colors.primary,
          }}
          testID='fixTemplateNextBtn'
          onPress={this.handleMainClick}>
            <Icon library="FontAwesome5" name="arrow-right" color={'accent'} />
          </TouchableOpacity>
      );
    }
}
