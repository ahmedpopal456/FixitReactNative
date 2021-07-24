export type ProgressIndicatorOperationStatusTypes = 'circular'|'linear';

export interface IndeterminateProgressIndicatorProps {
    /** Color of the Progress Bar */
    color: string,
    /** Indicator Type */
    indicatorType: ProgressIndicatorOperationStatusTypes,
  }
