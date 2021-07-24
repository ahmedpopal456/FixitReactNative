import React, {
  FunctionComponent,
} from 'react';
import * as Progress from 'react-native-progress';
import { DeterminateProgressIndicatorProps } from './determinateProgressIndicatorProps';

const DeterminateProgressIndicator: FunctionComponent<DeterminateProgressIndicatorProps> = (props) => {
  const render = () : JSX.Element => {
    let progressBar : JSX.Element = <></>;
    if (props.indicatorType === 'linear') {
      progressBar = <Progress.Bar
        color={props.color}
        progress={props.progress} />;
    } else if (props.indicatorType === 'circular') {
      progressBar = <Progress.Circle
        color={props.color}
        progress={props.progress} />;
    }
    return (
      progressBar);
  };

  return render();
};

DeterminateProgressIndicator.defaultProps = {
  color: 'orange',
  indicatorType: 'linear',
  progress: 0,
};

export default DeterminateProgressIndicator;
