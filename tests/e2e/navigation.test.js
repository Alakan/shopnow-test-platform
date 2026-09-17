const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { expect } = require('chai');

describe('E2E - navigation', function () {

    let driver;

    before(async function () {

        const options = new firefox.Options();

        options.setBinary(
            'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
        );

        driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();
    });

    after(async function () {

        if (driver) {
            await driver.quit();
        }

    });

    it('doit accéder à la page des produits', async function () {

        await driver.get('http://localhost:8081');

        const productsLink = await driver.wait(
            until.elementLocated(
                By.css('[data-testid="products-link"]')
            ),
            10000
        );

        await driver.wait(
            until.elementIsVisible(productsLink),
            10000
        );

        await driver.wait(
            until.elementIsEnabled(productsLink),
            10000
        );

        await productsLink.click();

        await driver.wait(
            until.urlContains('products'),
            10000
        );

        const productsPage = await driver.wait(
            until.elementLocated(
                By.css('[data-testid="products-page"]')
            ),
            10000
        );

        await driver.wait(
            until.elementIsVisible(productsPage),
            10000
        );

        expect(await productsPage.isDisplayed()).to.equal(true);
    });

});