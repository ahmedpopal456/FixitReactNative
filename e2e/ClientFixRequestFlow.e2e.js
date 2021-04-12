/* eslint-disable no-undef */
describe('Client Fix Request Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    await element(by.id('skipClient')).tap();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('searchBtn')).tap();
  });

  it('should allow user to submit a fix request with a blank fix template', async () => {
    await element(by.id('startBlankFixTemplateBtn')).tap();
    await expect(element(by.text('Create a Fixit Template and your Fixit Request'))).toBeVisible();
    await expect(element(by.text('Template Name'))).toBeVisible();
    await expect(element(by.text('Category'))).toBeVisible();
    await expect(element(by.text('Type'))).toBeVisible();
    await element(by.id('styledScrollView')).scrollTo('bottom');
    await expect(element(by.text('Unit'))).toBeVisible();
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
    await element(by.id('styledScrollView')).atIndex(1).scrollTo('bottom');
    await expect(element(by.text('Budget'))).toBeVisible();

    await element(by.id('fixTemplateNextBtn')).atIndex(1).tap();
    await expect(element(by.text('Review your Fixit Request'))).toBeVisible();
    await expect(element(by.text('Job Description'))).toBeVisible();
    await expect(element(by.text('Tags')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Images')).atIndex(1)).toBeVisible();
    await expect(element(by.text('Location')).atIndex(1)).toBeVisible();
    await element(by.id('styledScrollView')).atIndex(2).scroll(500, 'down');
    await expect(element(by.text('Availability')).atIndex(1)).toBeVisible();
    await element(by.id('styledScrollView')).atIndex(2).scrollTo('bottom');
    await expect(element(by.text('Expected Delivery Date'))).toBeVisible();
    await expect(element(by.text('Budget')).atIndex(1)).toBeVisible();
    await expect(element(by.text('System Cost Estimate'))).toBeVisible();

    await element(by.id('fixTemplateNextBtn')).atIndex(1).tap();
    await expect(element(by.text('Submit Fixit Request'))).toBeVisible();
  });
});
