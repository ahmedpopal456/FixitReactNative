import type { B2CConfiguration } from '../b2c/b2cClient';

export const b2cConfig: B2CConfiguration = {
  auth: {
    clientId: '{{Name}}',
    authorityBase: '{{AuthorityBase}}',
    policies: {
      signIn: '{{PolicyNameSignIn}}',
      signUp: '{{PolicyNameSignUp}}',
      passwordReset: '{{PolicyNamePwdReset}}',
      editProfile: '{{PolicyNameEditProfile}}',
    },
  },
};

export const b2cScopes = [
  '{{B2CScopes}}',
];
