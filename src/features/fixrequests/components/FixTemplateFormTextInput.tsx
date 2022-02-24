import { H2, Icon, Spacer } from 'fixit-common-ui';
import React from 'react';
import { View } from 'react-native';
import GlobalStyles from '../../../common/styles/globalStyles';
import { FormTextInput } from '../../../components/forms/index';

interface Props {
  header?: string;
  onChange(value: string): void;
  value: string;
  onFocus?(): void;
  onBlur?(): void;
  big?: boolean;
  top?: boolean;
  editable?: boolean;
}

const fixTemplateHeader = (props: Props): JSX.Element => {
  if (props.header) {
    if (props.editable) {
      return props.header ? <H2 style={GlobalStyles.boldTitle}>{props.header}</H2> : <></>;
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <H2 style={GlobalStyles.boldTitle}>{props.header}</H2>
          <Icon library="FontAwesome" name="lock" color="accent" />
        </View>
      );
    }
  }
  return <></>;
};

const FixTemplateFormTextInput = (props: Props): JSX.Element => (
  <>
    {fixTemplateHeader(props)}
    <Spacer height="5px" />
    <FormTextInput
      top={props.top}
      big={props.big}
      onChange={props.onChange}
      value={props.value}
      editable={props.editable ? props.editable : false}
    />
  </>
);

export default FixTemplateFormTextInput;
