# Advance Playwright Framework

A TypeScript + Playwright test automation framework for UI and API validation with reusable page objects, data-driven testing, logging, and custom HTML reporting.

## Overview

This project is built for fast, scalable, maintainable end-to-end test automation. It includes:

- Page Object Model (POM) architecture
- Environment-based configuration using .env
- Built-in logger utilities
- Reusable test data helpers
- Custom HTML report generation with screenshot, video, and trace links
- Support for headed and headless runs
- Browser automation using Playwright Test

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Faker
- dotenv
- Winston
- AJV
- csv-parse
- xlsx
- Custom HTML reporter

## Project Structure

```bash
ADVANCEPLAYWRIGHTFRAMEWORK/
├── src/
│   ├── api/
│   ├── config/
│   ├── fixtures/
│   ├── pages/
│   ├── testdata/
│   ├── tests/
│   └── utils/
├── docs/
├── rules/
├── tta-report/
├── .env
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── README.md
└── .gitignore
```

## Installation

```bash
npm install
npx playwright install
```

## Environment Setup

Create a `.env` file in the project root and set values similar to:

```bash
TEST_ENV=qa
BASE_URL=https://www.saucedemo.com/
```

You can also use project-specific environment values depending on the test configuration in your setup.

## Running Tests

```bash
# Run all tests
npx playwright test

# Run one spec
npx playwright test src/tests/login.spec.ts

# Run in headed mode
npx playwright test src/tests/login.spec.ts --project=chromium --headed

# Run with specific browser project
npx playwright test --project=chromium
```

## HTML Report

This project includes a custom HTML report that stores results in the `tta-report` folder and includes:

- Screenshot links
- Video links
- Trace links
- Test summary table
- per-test detail sections

To open the last generated report:

```bash
npx playwright show-report
```

The generated report files are created under:

```bash
tta-report/
```

## Custom Reporter

The reporter logic is implemented in:

```bash
src/utils/CustomReporter.ts
```

It writes a rich HTML dashboard and captures attachments from Playwright, including:

- screenshots
- video artifacts
- trace ZIP files

## Notes

- The reporter is designed to keep working even when optional AI modules are not available.
- If the project has no AI agent implementation present, the report falls back gracefully instead of crashing the test run.

## Author

Nishikant Pradhan
