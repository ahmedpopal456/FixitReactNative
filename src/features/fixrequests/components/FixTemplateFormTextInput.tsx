import { H2, Spacer } from 'fixit-common-ui';
import React from 'react';
import GlobalStyles from '../../../common/styles/globalStyles';
import { FormTextInput } from '../../../components/forms/index';

interface Props {
  header?: string,
  onChange(value: string): void,
  value: string,
  onFocus?(): void,
  onBlur?(): void,
  big?: boolean
}

const FixTemplateFormTextInput = (props: Props) : JSX.Element => (
  <>
    {props.header ? <H2 style={GlobalStyles.boldTitle}>{props.header}</H2> : <></>}
    <Spacer height="5px" />
    <FormTextInput
      big={props.big}
      onChange={props.onChange}
      value={props.value} />
  </>
);

export default FixTemplateFormTextInput;
