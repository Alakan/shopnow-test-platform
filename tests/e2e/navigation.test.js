const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

// Exemple minimal : les apprenants complètent ce dossier avec les scénarios E2E.
describe('E2E - navigation', function () {
  this.timeout(20000);
  let driver;
  before(async () => { driver = await new Builder().forBrowser('firefox').build(); });
  after(async () => { if (driver) await driver.quit(); });

  it('doit accéder à la page des produits', async () => {
    await driver.get('http://localhost:8081');
    await driver.findElement(By.css('[data-testid="products-link"]')).click();
    await driver.wait(until.elementLocated(By.css('[data-testid="products-page"]')), 10000);
    expect(await driver.getTitle()).to.contain('Produits');
  });
});
