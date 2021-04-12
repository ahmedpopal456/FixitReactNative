/* eslint-disable no-undef */
describe('Client Common Views', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have login button', async () => {
    await expect(element(by.id('loginButton'))).toBeVisible();
  });

  it('should have signup button', async () => {
    await expect(element(by.id('signupButton'))).toBeVisible();
  });

  it('should show client\'s home page', async () => {
    await element(by.id('skipClient')).tap();
    await expect(element(by.text('Most Popular Fixes'))).toBeVisible();
    await expect(element(by.text('Explore'))).toBeVisible();
    await expect(element(by.id('searchBtn'))).toBeVisible();
  });

  it('should allow client to navigate to profile from bottom navigation bar', async () => {
    await element(by.text('Profile')).tap();
    await expect(element(by.id('profileBtn'))).toBeVisible();
    await expect(element(by.id('loginSecurityBtn'))).toBeVisible();
    await expect(element(by.id('paymentBtn'))).toBeVisible();
    await expect(element(by.id('ratingsBtn'))).toBeVisible();
    await expect(element(by.id('addressBtn'))).toBeVisible();
  });

  it('should allow client to navigate to fixes from bottom navigation bar', async () => {
    await element(by.text('Fixes')).tap();
    await expect(element(by.id('fixesBtn'))).toBeVisible();
    await expect(element(by.id('fixRequestsBtn'))).toBeVisible();
  });

  it('should allow client to navigate to chat from bottom navigation bar', async () => {
    await element(by.text('Chat')).tap();
    await expect(element(by.id('activeMsg'))).toBeVisible();
    await expect(element(by.id('matchedMsg'))).toBeVisible();
    await expect(element(by.text('Chats'))).toBeVisible();
  });
});
