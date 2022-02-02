import { colors } from 'fixit-common-ui';
import React from 'react';
import { TextInput, View } from 'react-native';

export default class SearchTextInput extends React.Component<{
  onChange: (text: string) => void;
  onFocus(): void;
  big?: boolean;
  value?: string;
  placeholder?: string;
  onSubmitEditing(): void;
}> {
  textInput: TextInput | null | undefined;

  state = {
    value: this.props.value,
    placeholder: this.props.placeholder,
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

  render(): JSX.Element {
    return (
      <View
        style={{
          position: 'relative',
        }}>
        <TextInput
          ref={(c) => {
            this.textInput = c;
          }}
          onFocus={() => this.onFocus()}
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            width: 345,
            maxWidth: 345,
            fontSize: 20,
            paddingHorizontal: 20,
            height: 60,
          }}
          multiline={this.props.big}
          selectionColor={colors.accent}
          value={this.props.value}
          onChangeText={this.props.onChange}
          placeholder={this.props.placeholder}
          onSubmitEditing={this.props.onSubmitEditing}
          maxLength={25}
        />
      </View>
    );
  }
}
