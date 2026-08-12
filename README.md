# Advance Playwright Framework

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=15,85,180,255,120&height=220&section=header&text=Advance%20Playwright%20Framework&fontSize=42&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=UI%20%2B%20API%20Automation%20with%20Playwright%20%7C%20TypeScript&descAlignY=60&descSize=18" />
</div>

<div align="center">
  <div style="display:inline-flex;align-items:center;gap:10px;padding:10px 22px;border-radius:999px;background:linear-gradient(135deg,#ff4d6d,#ff8a00,#ffd166,#06d6a0,#118ab2,#7b2ff7);color:#fff;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;box-shadow:0 0 22px rgba(123,47,247,0.45);">
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
