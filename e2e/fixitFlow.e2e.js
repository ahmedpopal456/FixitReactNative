/* eslint-disable no-undef */
describe('Fixit App flow', () => {
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
    await element(by.id('skip')).tap();
    await expect(element(by.text('Home client'))).toBeVisible();
    await expect(element(by.text('Search'))).toBeVisible();
  });

  it('should show fix request flow', async () => {
    await element(by.text('Search')).tap();
    await expect(element(by.text('Start from a Fixit Template'))).toBeVisible();
    await expect(element(by.text('Start with a blank fix template'))).toBeVisible();

    await element(by.id('startFixTemplateBtn')).tap();
    await expect(element(by.text('Create a Fixit Template and your Fixit Request'))).toBeVisible();
    await expect(element(by.text('Template Name'))).toBeVisible();
    await expect(element(by.text('Category'))).toBeVisible();
    await expect(element(by.text('Type'))).toBeVisible();
    await expect(element(by.text('Fix Title'))).toBeVisible();
    await expect(element(by.text('Tags'))).toBeVisible();

    await element(by.id('fixTemplateNextBtn')).tap();
    await expect(element(by.text('Fix Description'))).toBeVisible();

    await element(by.id('fixTemplateNextOptionsBtn')).tap();
    await expect(element(by.text('Save Fixit Template & Continue'))).toBeVisible();
    await expect(element(by.text('Add New Section'))).toBeVisible();

    await element(by.text('Save Fixit Template & Continue')).tap();
    await expect(element(by.text('Images'))).toBeVisible();
    await expect(element(by.text('Location'))).toBeVisible();
    await expect(element(by.text('Address'))).toBeVisible();
    await expect(element(by.text('City'))).toBeVisible();
    await expect(element(by.text('Province'))).toBeVisible();
    await expect(element(by.text('Postal code'))).toBeVisible();

    await element(by.id('fixTemplateNextBtn')).atIndex(1).tap();
    await expect(element(by.text('Availability'))).toBeVisible();
    await expect(element(by.text('Budget'))).toBeVisible();

    await element(by.id('fixTemplateNextBtn')).atIndex(1).tap();
    await expect(element(by.text('Review your Fixit Request'))).toBeVisible();
    await expect(element(by.text('Category')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Type')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Job Description'))).toBeVisible();
    await expect(element(by.text('Tags')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Images')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Location')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Availability')).atIndex(1)).toBeVisible();
    await element(by.id('styledScrollView')).scrollTo('bottom');
    await expect(element(by.text('Expected Delivery Date'))).toBeVisible();
    await expect(element(by.text('Budget')).atIndex(1)).toBeVisible();
    await expect(element(by.text('System Cost Estimate'))).toBeVisible();

    await element(by.id('fixTemplateNextBtn')).atIndex(1).tap();
    await expect(element(by.text('Submit Fixit Request'))).toBeVisible();
  });

  it('should show account page', async () => {
    await element(by.text('Profile')).tap();
    await expect(element(by.id('signOutBtn'))).toBeVisible();
    await expect(element(by.text('Po Tato'))).toBeVisible();
    await expect(element(by.id('profileBtn'))).toBeVisible();
    await expect(element(by.id('loginSecurityBtn'))).toBeVisible();
    await expect(element(by.id('paymentBtn'))).toBeVisible();
    await expect(element(by.id('ratingsBtn'))).toBeVisible();
    await expect(element(by.id('addressBtn'))).toBeVisible();
  });
});
