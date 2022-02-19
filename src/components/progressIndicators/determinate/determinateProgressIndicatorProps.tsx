export type ProgressIndicatorOperationStatusTypes = 'circular' | 'linear';

export interface DeterminateProgressIndicatorProps {
  /** Color of the Progress Bar */
  color: string;
  /** Progress percentage shown */
  progress: number;
  /** Indicator Type */
  indicatorType: ProgressIndicatorOperationStatusTypes;
}
