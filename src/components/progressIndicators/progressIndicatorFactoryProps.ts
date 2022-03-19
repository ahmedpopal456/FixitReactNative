import { DeterminateProgressIndicatorProps } from './determinate/determinateProgressIndicatorProps';
import { IndeterminateProgressIndicatorProps } from './indeterminate/indeterminateProgressIndicatorProps';

export type ProgressIndicatorTypes = 'determinate' | 'indeterminate';

export type ProgressIndicatorChildenPropsTypes =
  | IndeterminateProgressIndicatorProps
  | DeterminateProgressIndicatorProps;

export interface ProgressIndicatorFactoryProps {
  /** Type of Progress Bar to Render */
  type: ProgressIndicatorTypes;
  /** Type of the Factory's children */
  children: ProgressIndicatorChildenPropsTypes;
}
