import { H2, Spacer, colors } from 'fixit-common-ui';
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';
import { Category, Type, Unit } from 'fixit-common-data-store';
import GlobalStyles from '../../../common/styles/globalStyles';

interface Props {
  header?: string;
  onChange(value: Category | Type | Unit | any): void;
  selectedValue: any;
  values: Array<any>;
}

const FixTemplatePicker = (props: Props): JSX.Element => (
  <>
    {props.header ? <H2 style={GlobalStyles.boldTitle}>{props.header}</H2> : null}
    <Spacer height="5px" />
    {props.values ? (
      <View
        style={{
          borderColor: colors.grey,
          borderWidth: 1,
          borderRadius: 15,
        }}>
        <Picker selectedValue={props.selectedValue} onValueChange={props.onChange}>
          {props.values.map((value: any) => (
            <Picker.Item key={value.id} label={value.name} value={value} />
          ))}
        </Picker>
      </View>
    ) : null}
  </>
);

export default FixTemplatePicker;
