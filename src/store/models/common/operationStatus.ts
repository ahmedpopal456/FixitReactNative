export interface OperationStatus<T = unknown> {
  isOperationSuccessful: boolean;
  operationException: any;
  result?: T;
}
