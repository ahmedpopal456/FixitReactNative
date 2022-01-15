import type { B2CTypes } from 'fixit-common-data-store';

export const b2cConfig: B2CTypes.B2CConfiguration = {
  auth: {
    clientId: '60d0d7ce-85ff-427d-ae26-8e1510bb776d',
    authorityBase: 'https://fixitb2ctest.b2clogin.com/fixitb2ctest.onmicrosoft.com',
    policies: {
      signIn: 'B2C_1A_SIGNIN',
      signUp: 'B2C_1A_SIGNUP',
      passwordReset: 'B2C_1A_PASSWORDRESET',
      editProfile: 'B2C_1A_PROFILEEDIT',
    },
  },
};

export const b2cScopes = [
  'https://FixitB2CTest.onmicrosoft.com/60d0d7ce-85ff-427d-ae26-8e1510bb776d/user_impersonation',
];
