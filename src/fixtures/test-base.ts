import {test as base, expect} from '@playwright/test';
import {requireEnv} from '@config/env';
import {LoginPage} from '@pages/LoginPage';
import {CartPage} from '@pages/CartPage';
import {CheckoutCompletePage} from '@pages/CheckoutCompletePage';
import {ItemDetailPage} from '@pages/ItemDetailPage';
import {InventoryPage} from '@pages/InventoryPage';
import {CheckoutStepOnePage} from '@pages/CheckoutStepOnePage';
import {CheckoutStepTwoPage} from '@pages/CheckoutStepTwoPage';

type LoginState = { loginPage: LoginPage; username: string };
type InventoryState = LoginState & { inventoryPage: InventoryPage };

export type TestFixtures = {

    //Page Objects
    loginPage: LoginPage;
    cartPage: CartPage;
    checkoutCompletePage: CheckoutCompletePage;
    itemDetailPage: ItemDetailPage;
    inventoryPage: InventoryPage;
    checkoutStepOnePage: CheckoutStepOnePage;
    checkoutStepTwoPage: CheckoutStepTwoPage;
    invalidLogin: LoginState;
    validLogin: LoginState;
    loginWithInventory: InventoryState;
    loginWithSelectedItem: InventoryState & { itemId: string };
};

export const test = base.extend<TestFixtures>({
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },
    cartPage: async ({page}, use) => {
        await use(new CartPage(page));
    },
    checkoutCompletePage: async ({page}, use) => {
        await use(new CheckoutCompletePage(page));
    },
    itemDetailPage: async ({page}, use) => {
        await use(new ItemDetailPage(page));
    },
    inventoryPage: async ({page}, use) => {
        await use(new InventoryPage(page));
    },
    checkoutStepOnePage: async ({page}, use) => {
        await use(new CheckoutStepOnePage(page));
    },
    checkoutStepTwoPage: async ({page}, use) => {
        await use(new CheckoutStepTwoPage(page));
    },
    invalidLogin: async ({page, loginPage}, use) => {
        const username = 'invalid_fixture_user';
        await loginPage.open();
        await loginPage.loginAs(username, 'invalid_fixture_password');
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).not.toHaveText('');
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
        await use({loginPage, username});
    },
    validLogin: async ({page, loginPage}, use) => {
        const username = requireEnv('STANDARD_USER');
        await loginPage.open();
        await loginPage.loginAs(username, requireEnv('TTA_SECRET'));
        await expect(page).toHaveURL(/\/inventory\.html(?:[?#].*)?$/);
        await loginPage.waitForLoginButtonHidden();
        await use({loginPage, username});
    },
    loginWithInventory: async ({validLogin, inventoryPage}, use) => {
        await inventoryPage.assertLoaded();
        await use({...validLogin, inventoryPage});
    },
    loginWithSelectedItem: async ({page, loginWithInventory}, use) => {
        const itemId = 'test-allthethings-tshirt-red';
        await loginWithInventory.inventoryPage.addToCart(itemId);
        await expect(page.locator(`[data-test="remove-${itemId}"]`)).toBeVisible();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await use({...loginWithInventory, itemId});
    },

});

export {expect} from '@playwright/test';
