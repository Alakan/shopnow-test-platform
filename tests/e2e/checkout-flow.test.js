const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { expect } = require('chai');

describe('E2E - parcours utilisateur complet', function () {
    this.timeout(60000);

    let driver;

    before(async function () {
        const options = new firefox.Options();
        options.addArguments('-headless');
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

    it('doit connecter, ajouter un produit, modifier le panier et vérifier le total', async function () {
        await driver.get('http://localhost:8081');

        const loginLink = await driver.wait(
            until.elementLocated(By.css('[data-testid="login-link"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(loginLink), 10000);
        await loginLink.click();

        const emailInput = await driver.wait(
            until.elementLocated(By.css('[data-testid="login-email"]')),
            10000
        );
        const passwordInput = await driver.wait(
            until.elementLocated(By.css('[data-testid="login-password"]')),
            10000
        );
        await emailInput.clear();
        await emailInput.sendKeys('student@shopnow.test');
        await passwordInput.clear();
        await passwordInput.sendKeys('Password123!');

        const submitButton = await driver.wait(
            until.elementLocated(By.css('[data-testid="login-submit"]')),
            10000
        );
        await submitButton.click();

        await driver.wait(
            until.urlContains('/products.html'),
            10000
        );

        const productLink = await driver.wait(
            until.elementLocated(By.css('[data-testid="view-product-1"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(productLink), 10000);
        await productLink.click();

        await driver.wait(
            until.elementLocated(By.css('[data-testid="product-page"]')),
            10000
        );

        const addButton = await driver.wait(
            until.elementLocated(By.css('[data-testid="add-to-cart-1"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(addButton), 10000);
        await addButton.click();

        await driver.switchTo().alert().accept();

        await driver.get('http://localhost:8081/cart.html');

        const cart = await driver.wait(
            until.elementLocated(By.css('[data-testid="cart"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(cart), 10000);

        const qty = await driver.wait(
            until.elementLocated(By.css('[data-testid="quantity-1"]')),
            10000
        );
        const initialQty = Number(await qty.getText());
        expect(initialQty).to.equal(1);

        const increaseButton = await driver.wait(
            until.elementLocated(By.css('[data-testid="increase-1"]')),
            10000
        );
        await increaseButton.click();

        await driver.wait(async () => {
            const value = await driver.findElement(By.css('[data-testid="quantity-1"]')).getText();
            return Number(value) === 2;
        }, 10000);

        const totalText = await driver.findElement(By.css('.summary-total strong')).getText();
        expect(totalText).to.equal('2 599,98 €');

        const removeButton = await driver.wait(
            until.elementLocated(By.css('[data-testid="remove-item-1"]')),
            10000
        );
        await removeButton.click();

        await driver.wait(
            until.elementLocated(By.css('[data-testid="empty-cart"]')),
            10000
        );

        const emptyCart = await driver.findElement(By.css('[data-testid="empty-cart"]'));
        expect(await emptyCart.isDisplayed()).to.equal(true);
    });
});
