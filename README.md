# Advance Playwright Framework

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=238,73,73,255,71,96,255,170,0&height=260&section=header&text=Advance%20Playwright%20Framework&fontSize=44&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=UI%20%2B%20API%20Automation%20with%20Playwright%20%7C%20TypeScript&descAlignY=60&descSize=17" />
</div>

<div align="center">
  <img alt="Playwright Badge" src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" />
  <img alt="TypeScript Badge" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Node.js Badge" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="HTML Report Badge" src="https://img.shields.io/badge/HTML%20Report-Custom-FF6B6B?style=for-the-badge" />
</div>

<div align="center" style="margin: 18px 0 12px 0;">
  <div style="display:inline-flex;align-items:center;gap:10px;padding:10px 24px;border-radius:999px;background:linear-gradient(135deg,#ff4d6d,#ff8a00,#ffd166,#06d6a0,#118ab2,#7b2ff7);color:#fff;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;box-shadow:0 0 22px rgba(123,47,247,0.45), 0 0 16px rgba(255,107,107,0.35);">
    <span style="width:12px;height:12px;border-radius:50%;background:#fff;display:inline-block;box-shadow:0 0 14px rgba(255,255,255,0.9);animation:pulse 1.4s infinite ease-in-out;"></span>
    Live Automation
  </div>
</div>

<style>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.84); opacity: 0.7; }
}
</style>

A TypeScript + Playwright framework for end-to-end web testing with reusable page objects, environment configuration, data-driven utilities, custom reporting, and rich browser automation workflows.

## Overview

This project is designed for stable and scalable UI automation using Playwright and TypeScript. It includes:

- Page Object Model structure for reusable browser interactions
- Environment-aware configuration via .env and Playwright config
- Centralized logger utility
- Custom HTML report generator with screenshot, video, and trace links
- Support for headless and headed execution
- Browser automation covering login and cart journey flows

## Tech Stack

- Playwright Test
- TypeScript
- Node.js
- Faker
- dotenv
- Winston
- AJV
- csv-parse
- xlsx
- Custom HTML Reporter

## Project Structure

```bash
ADVANCEPLAYWRIGHTFRAMEWORK/
├── .github/
├── docs/
├── logs/
├── reports/
├── rules/
├── src/
│   ├── api/
│   ├── config/
│   ├── fixtures/
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── ...
│   ├── testdata/
│   ├── tests/
│   │   └── login.spec.ts
│   └── utils/
│       ├── CustomReporter.ts
│       ├── DataGenerator.ts
│       ├── logger.ts
│       └── UtilElementLocator.ts
├── .env
├── .gitignore
├── package.json
├── playwright.config.ts
├── README.md
├── tsconfig.json
├── test-results/
├── tta-report/
└── playwright-report/
```

## Features

- Browser automation for UI testing with Playwright
- Base page abstraction and page object structure
- Login flow validation using TTACart demo app
- Environment variables for QA, DEV, STAGE, PROD, and API endpoints
- Real-time HTML reporting with row-level links to artifacts
- Screenshot and video recording on test execution
- Trace file generation for debugging
- Type-safe configuration with tsconfig path aliases

## Prerequisites

- Node.js 18+
- npm 9+
- Playwright browser dependencies

## Installation

```bash
npm install
npx playwright install
```

## Environment Configuration

The framework uses a `.env` file with environment-specific overrides. The Playwright config resolves URLs based on the selected environment.

Supported environment values in the project config:

- `qa`
- `dev`
- `local`
- `stage`
- `prod`
- `production`
- `api`

Example:

```bash
TEST_ENV=qa
BASE_URL=https://www.saucedemo.com/
QA_BASE_URL=https://qa-app.thetestingacademy.com
DEV_BASE_URL=https://dev-app.thetestingacademy.com
STAGE_BASE_URL=https://stage-app.thetestingacademy.com
PROD_BASE_URL=https://app.thetestingacademy.com
BASE_URL_API=https://restful-booker.herokuapp.com
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific spec
npx playwright test src/tests/login.spec.ts

# Run a specific browser project
npx playwright test --project=chromium

# Run in headed mode
npx playwright test src/tests/login.spec.ts --project=chromium --headed

# Run with debug mode
npx playwright test --debug
```

## Playwright Configuration

The project uses the following configuration in [playwright.config.ts](playwright.config.ts):

- test directory: `src/tests`
- reporter: list + HTML + custom TTA reporter
- base URL resolved from env variables
- screenshot on failure
- video enabled
- trace enabled
- chromium project configured for desktop browser

## Custom Reporting

The custom report is implemented in [src/utils/CustomReporter.ts](src/utils/CustomReporter.ts).

It generates a rich HTML report with:

- summary dashboard
- per-test rows
- screenshot link
- video link
- trace link
- file and status information
- live banner styling

Reports are generated in the `tta-report` folder.

## Opening Reports

```bash
npx playwright show-report
```

Or open the generated HTML directly from the `tta-report` folder.

## Example Test

The sample login flow is in [src/tests/login.spec.ts](src/tests/login.spec.ts).

It demonstrates:

- page object usage
- test steps and logging
- assertion on hidden login button after successful login

## Logger and Utilities

The project includes common support utilities:

- [src/utils/logger.ts](src/utils/logger.ts): Winston logger with file + console output
- [src/utils/UtilElementLocator.ts](src/utils/UtilElementLocator.ts): element helper wrapper
- [src/utils/DataGenerator.ts](src/utils/DataGenerator.ts): data generation utilities
- [src/pages/BasePage.ts](src/pages/BasePage.ts): shared page/base structure
- [src/pages/LoginPage.ts](src/pages/LoginPage.ts): login page object

## Notes

- The custom reporter is resilient when optional AI modules are not present.
- The generated HTML report keeps working even without external AI dependencies.
- Artifact folders like `tta-report/`, `playwright-report/`, and `reports/` are used to keep execution results and historical snapshots.

## Author

Nishikant Pradhan
