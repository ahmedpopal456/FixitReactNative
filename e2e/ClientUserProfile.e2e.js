/* eslint-disable no-undef */
describe('Client User Profile', () => {
  beforeAll(async () => {
    await device.launchApp();
    await element(by.id('skipClient')).tap();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.text('Profile')).tap();
  });

  it('should have all user profile menu options', async () => {
    await expect(element(by.id('profileBtn'))).toBeVisible();
    await expect(element(by.id('loginSecurityBtn'))).toBeVisible();
    await expect(element(by.id('paymentBtn'))).toBeVisible();
    await expect(element(by.id('ratingsBtn'))).toBeVisible();
    await expect(element(by.id('addressBtn'))).toBeVisible();
  });

  it('should show user profile details', async () => {
    await element(by.id('profileBtn')).tap();
    await expect(element(by.text('Name'))).toBeVisible();
    await expect(element(by.text('Email'))).toBeVisible();
    await expect(element(by.text('Location'))).toBeVisible();
    await expect(element(by.id('profilePhoto'))).toBeVisible();
  });

  it('should show login & security', async () => {
    await element(by.id('loginSecurityBtn')).tap();
    await expect(element(by.text('First Name'))).toBeVisible();
    await expect(element(by.text('Last Name'))).toBeVisible();
    await expect(element(by.text('Email'))).toBeVisible();
    await expect(element(by.text('Phone Number'))).toBeVisible();
    await expect(element(by.text('Location'))).toBeVisible();
  });

  it('should allow user to enter text in field and persist changes', async () => {
    const randomNumber = Math.floor(Math.random() * 1000000000).toString();

    await element(by.id('loginSecurityBtn')).tap();
    const phoneInput = element(by.id('securityPhoneInput'));
    await expect(phoneInput).toBeVisible();
    await phoneInput.clearText();
    await phoneInput.typeText(randomNumber);
    await element(by.id('updateBtn')).tap();

    await element(by.id('backBtn')).tap();
    await element(by.id('loginSecurityBtn')).tap();
    await expect(phoneInput).toHaveText(randomNumber);
  });

  it('should show ratings', async () => {
    await element(by.id('ratingsBtn')).tap();
    await expect(element(by.text('Your Ratings'))).toBeVisible();
    await expect(element(by.id('ratingItem')).atIndex(0)).toBeVisible();
  });

  it('should allow user to view rating details', async () => {
    await element(by.id('ratingsBtn')).tap();
    await element(by.id('ratingItem')).atIndex(0).tap();
    await expect(element(by.id('ratingItemDetails'))).toBeVisible();
  });
});
