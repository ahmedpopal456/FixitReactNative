import { OperationStatus } from './operationStatus';

export interface PagedDocumentCollection<T = unknown> extends OperationStatus {
  results?: Array<T>;
  totalDocumentCount: number;
  pageNumber: number;
  pageCount?: number;
}
