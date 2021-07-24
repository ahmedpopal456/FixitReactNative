import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

import { ProgressIndicatorFactoryProps } from './progressIndicatorFactoryProps';
import { IndeterminateProgressIndicatorProps } from './indeterminate/indeterminateProgressIndicatorProps';
import DeterminateProgressIndicator from './determinate/determinateProgressIndicator';
import IndeterminateProgressIndicator from './indeterminate/indeterminateProgressIndicator';
import { DeterminateProgressIndicatorProps } from './determinate/determinateProgressIndicatorProps';

const ProgressIndicatorFactory : FunctionComponent<PropsWithChildren<ProgressIndicatorFactoryProps>> = (props) => {
  switch (props.type) {
    case 'determinate':
      return <DeterminateProgressIndicator
        {...(props.children as DeterminateProgressIndicatorProps & ReactNode)} />;
    case 'indeterminate':
      return <IndeterminateProgressIndicator
        {...(props.children as IndeterminateProgressIndicatorProps & ReactNode)} />;
    default:
      return <></>;
  }
};

ProgressIndicatorFactory.defaultProps = {
  type: 'indeterminate',
  children: {
    color: 'orange',
    indicatorType: 'circular',
  },
};

export default ProgressIndicatorFactory;
