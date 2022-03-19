export interface LicenseDto {
  id: string;
  referenceId: number;
  name: string;
  description: string;
  createdByUserId: string;
  updatedByUserId: string;
  tags: string[];
}
