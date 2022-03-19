import { colors } from 'fixit-common-ui';
import React, { FunctionComponent, useRef } from 'react';
import { TextInput, Text, View } from 'react-native';
import StyledTextInput from '../styledElements/styledTextInput';

interface FormTextInputProps {
  onChange: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  big?: boolean;
  value?: string;
  title?: string;
  padLeft?: boolean;
  top?: boolean;
  numeric?: boolean;
  editable: boolean;
}

const FormTextInput: FunctionComponent<FormTextInputProps> = (props: FormTextInputProps) => {
  let textInputRef = useRef<TextInput>();
  const onFocus = (): void => {
    textInputRef?.current?.setNativeProps({
      style: { borderColor: colors.accent },
    });
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const onBlur = (): void => {
    textInputRef?.current?.setNativeProps({
      style: { borderColor: colors.grey },
    });
    if (props.onBlur) {
      props.onBlur();
    }
  };

  return (
    <>
      <View
        style={{
          position: 'relative',
        }}>
        <View style={{ flexDirection: 'row' }}>
          {props.title ? (
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
                {props.title}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        <StyledTextInput
          ref={(value: any) => {
            textInputRef.current = value;
          }}
          keyboardType={props.numeric ? 'numeric' : 'default'}
          onBlur={onBlur}
          onFocus={onFocus}
          style={{
            height: props.big ? 150 : 50,
            paddingLeft: props.padLeft ? 30 : 10,
            textAlignVertical: props.top ? 'top' : 'center',
          }}
          multiline={props.big}
          selectionColor={colors.accent}
          value={props.value}
          onChangeText={props.onChange}
          editable={props.editable}
        />
      </View>
    </>
  );
};

FormTextInput.defaultProps = {
  editable: true,
};

export default FormTextInput;
