import {test, expect} from '@playwright/test';
import {LoginPage} from '@pages/LoginPage';
import {createLogger} from '@utils/logger';

const log = createLogger('login.spec');

test.describe('TTACart Login Page', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({page}) => { 
        loginPage = new LoginPage(page);
        await test.step('Open the TTACart login page', async () => {
            log.info('Opening the TTACart login page');
            await loginPage.open();
        });
    });

    test('logs in with valid credentials @p0', async ({page}) => {
        await test.step('Login as standard_user', async () => {
            log.info('Logging in as standard_user');
            await loginPage.loginAs('standard_user', 'tta_secret');
        });
        await test.step('Verify login form is no longer show', async () => {
            log.info('Asserting that the login form is no longer visible');
            await expect(page.locator('[data-test="login-button"]')).toBeHidden();
        });
    });
});