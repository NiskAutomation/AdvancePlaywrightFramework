import {test as base} from '@playwright/test';
import {LoginPage} from '@pages/LoginPage';
import {CartPage} from '@pages/CartPage';
import {CheckoutCompletePage} from '@pages/CheckoutCompletePage';
import {ItemDetailPage} from '@pages/ItemDetailPage';
import {InventoryPage} from '@pages/InventoryPage';
import {CheckoutStepOnePage} from '@pages/CheckoutStepOnePage';
import {CheckoutStepTwoPage} from '@pages/CheckoutStepTwoPage';


export type TestFixtures = {

    //Page Objects
    loginPage: LoginPage;
    cartPage: CartPage;
    checkoutCompletePage: CheckoutCompletePage;
    itemDetailPage: ItemDetailPage;
    inventoryPage: InventoryPage;
    checkoutStepOnePage: CheckoutStepOnePage;
    checkoutStepTwoPage: CheckoutStepTwoPage;
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
    }

});

export {expect} from '@playwright/test';
