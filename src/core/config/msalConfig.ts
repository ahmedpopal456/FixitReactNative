import type { B2CTypes } from 'fixit-common-data-store';

export const b2cConfig: B2CTypes.B2CConfiguration = {
  auth: {
    clientId: '60d0d7ce-85ff-427d-ae26-8e1510bb776d',
    authorityBase: 'https://fixitb2ctest.b2clogin.com/fixitb2ctest.onmicrosoft.com',
    policies: {
      signIn: 'B2C_1A-signin',
      signUp: 'B2C_1A_signup',
      passwordReset: 'B2C_1A_PasswordReset',
      editProfile: 'B2C_1A_ProfileEdit',
    },
  },
};

export const b2cScopes = [
  'https://FixitB2CTest.onmicrosoft.com/60d0d7ce-85ff-427d-ae26-8e1510bb776d/user_impersonation',
];
