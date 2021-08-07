import { H2, Spacer, colors } from 'fixit-common-ui';
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';
import { Category, Type, Unit } from 'fixit-common-data-store';
import GlobalStyles from '../../../common/styles/globalStyles';

interface Props {
  header: string,
  onChange(value: Category | Type | Unit): void,
  selectedValue: any
  values: Array<any>
}

const FixTemplatePicker = (props: Props) : JSX.Element => (
  <>
    <H2 style={GlobalStyles.boldTitle}>{props.header}</H2>
    <Spacer height="5px" />
    {props.values
      ? <View
        style={{
          borderColor: colors.grey,
          borderWidth: 1,
          borderRadius: 15,
        }}><Picker
          selectedValue={props.selectedValue}
          onValueChange={props.onChange}>
          {props.values.map((value:any) => (
            <Picker.Item key={value.id} label={value.name} value={value} />
          ))}
        </Picker></View>
      : null
    }
  </>
);

export default FixTemplatePicker;
