import React, {
  FunctionComponent,
} from 'react';
import * as Progress from 'react-native-progress';
import { IndeterminateProgressIndicatorProps } from './indeterminateProgressIndicatorProps';

const IndeterminateProgressIndicator: FunctionComponent<IndeterminateProgressIndicatorProps> = (props) => {
  const render = () : JSX.Element => {
    let progressBar : JSX.Element = <></>;
    if (props.indicatorType === 'linear') {
      progressBar = <Progress.Bar
        color={props.color}
        indeterminate={true} />;
    } else if (props.indicatorType === 'circular') {
      progressBar = <Progress.Circle
        color={props.color}
        indeterminate={true} />;
    }
    return (
      progressBar);
  };

  return render();
};

IndeterminateProgressIndicator.defaultProps = {
  color: 'orange',
  indicatorType: 'linear',
};

export default IndeterminateProgressIndicator;
