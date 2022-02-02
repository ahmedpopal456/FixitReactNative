import { colors } from 'fixit-common-ui';
import React from 'react';
import { TextInput, Text, View } from 'react-native';
import StyledTextInput from '../styledElements/styledTextInput';

export default class FormTextInput extends React.Component<{
  onChange: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  big?: boolean;
  value?: string;
  title?: string;
  padLeft?: boolean;
  top?: boolean;
  numeric?: boolean;
}> {
  textInput: TextInput | null | undefined;

  state = {
    value: this.props.value,
  };

  onFocus = (): void => {
    if (this.textInput) {
      this.textInput.setNativeProps({
        style: { borderColor: colors.accent },
      });
    }
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  onBlur = (): void => {
    if (this.textInput) {
      this.textInput.setNativeProps({
        style: { borderColor: colors.grey },
      });
    }
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  render(): JSX.Element {
    return (
      <>
        <View
          style={{
            position: 'relative',
          }}>
          {this.props.title && (
            <View
              style={{
                backgroundColor: 'transparent',
                zIndex: 1,
                elevation: 1,
                position: 'absolute',
                top: -10,
                left: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  backgroundColor: '#fff',
                  padding: 3,
                }}>
                {this.props.title}
              </Text>
            </View>
          )}
          <StyledTextInput
            ref={(c) => {
              this.textInput = c;
            }}
            keyboardType={this.props.numeric ? 'numeric' : 'default'}
            onBlur={() => this.onBlur()}
            onFocus={() => this.onFocus()}
            style={{
              height: this.props.big ? 150 : 50,
              paddingLeft: this.props.padLeft ? 30 : 10,
              textAlignVertical: this.props.top ? 'top' : 'center',
            }}
            multiline={this.props.big}
            selectionColor={colors.accent}
            value={this.props.value}
            onChangeText={this.props.onChange}
          />
        </View>
      </>
    );
  }
}
