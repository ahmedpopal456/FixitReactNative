import React from 'react';
import { View } from 'react-native';
import { colors } from 'fixit-common-ui';

const IndicatorBar = (props: { isCurrent: boolean; }) => (
  <View style={{
    height: 2,
    flexGrow: 1,
    margin: 2,
    backgroundColor: (props.isCurrent) ? colors.accent : colors.grey,
  }}></View>
);

export default class StepIndicator extends
  React.Component<{numberSteps:number, currentStep:number}> {
    createStepIndicators = () : JSX.Element[] => {
      const stepIndicators = [];

      for (let i = 1; i <= this.props.numberSteps; i += 1) {
        stepIndicators.push(<IndicatorBar key={i} isCurrent={i === this.props.currentStep}/>);
      }
      return stepIndicators;
    }

    render() : JSX.Element {
      return (
        <>
          <View style={{
            position: 'absolute',
            flex: 1,
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: '#fff',
            padding: 10,
            paddingLeft: 18,
            paddingRight: 18,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            flexDirection: 'row',
          }}>
            {this.createStepIndicators()}
          </View>
        </>
      );
    }
}
