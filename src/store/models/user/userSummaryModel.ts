import { UserAddressModel, UserStatus } from '../../../store/slices/userSlice';
import { UserLicenseDto } from '../license/userLicenseDto';

export interface UserSummaryModel {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  licenses: UserLicenseDto[];
  role: number;
  userPrincipalName: string;
  savedAddresses: Array<UserAddressModel>;
  status: UserStatus;
}
