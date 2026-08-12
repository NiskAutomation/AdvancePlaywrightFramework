import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

function resolveBASEURL(): string {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const env = (process.env.TT_ENV || 'qa').toLowerCase();
  switch (env) {
    case 'api':
      return process.env.BASE_URL_API || 'https://restful-booker.herokuapp.com';
    case 'dev':
    case 'local':
      return process.env.DEV_BASE_URL || 'https://dev-app.thetestingacademy.com';
    case 'stage':
      return process.env.STAGE_BASE_URL || 'https://stage-app.thetestingacademy.com';
    case 'prod':
    case 'production':
      return process.env.PROD_BASE_URL || 'https://app.thetestingacademy.com';
    case 'qa':
      return process.env.QA_BASE_URL || 'https://qa-app.thetestingacademy.com';
    default:
      return process.env.BASE_URL || 'https://app.thetestingacademy.com';
  }
}

export default defineConfig({
  testDir: './src/tests',
  timeout: 60_000,

  expect: {
    timeout: 10_000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./src/utils/CustomReporter.ts'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: resolveBASEURL(),
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
