# Advance Playwright Framework

A scalable, enterprise-grade end-to-end test automation framework built with [Playwright](https://playwright.dev/) and TypeScript.

---

## Project Structure

```
AdvancePlaywrightFramework/
├── src/
│   ├── api/          → API clients (REST helpers)
│   ├── config/       → Environment configuration
│   ├── fixtures/     → Custom Playwright fixtures
│   ├── pages/        → Page Object Model (POM)
│   ├── testdata/     → Test data (JSON, CSV, Excel)
│   ├── tests/        → Test cases
│   └── utils/        → Reusable utilities & helpers
├── docs/             → Documentation
├── rules/            → Coding & framework conventions
├── .github/          → GitHub Actions CI workflows
├── .env              → Environment variables (not committed)
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev/) | ^1.62.1 | Browser automation & test runner |
| TypeScript | Latest | Typed JavaScript |
| Allure | ^3.10.2 | Test reporting |
| Faker.js | ^10.5.0 | Random test data generation |
| AJV | ^8.20.0 | JSON Schema validation |
| dotenv | ^17.4.2 | Environment variable management |
| Winston | ^3.19.0 | Logging |
| csv-parse | ^7.0.2 | CSV data-driven testing |
| xlsx | ^0.18.5 | Excel data-driven testing |
| jsonpath-plus | ^10.4.0 | JSONPath queries on API responses |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/NiskAutomation/AdvancePlaywrightFramework.git
cd AdvancePlaywrightFramework
npm install
npx playwright install
```

### Environment Setup

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `TT_ENV` | Target environment: `qa`, `dev`, `stage`, `prod`, `api` |
| `BASE_URL` | Override base URL directly |
| `QA_BASE_URL` | QA environment URL |
| `DEV_BASE_URL` | Dev environment URL |
| `STAGE_BASE_URL` | Stage environment URL |
| `PROD_BASE_URL` | Production URL |
| `BASE_URL_API` | API base URL |

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run with a specific environment
TT_ENV=qa npx playwright test
TT_ENV=dev npx playwright test
TT_ENV=prod npx playwright test

# Run a specific test file
npx playwright test src/tests/login.spec.ts

# Run in headed mode
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
```

---

## Reports

### HTML Report
```bash
npx playwright test
npx playwright show-report
```

### Allure Report
```bash
npx playwright test
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

## Libraries

See [docs/LIBRARIES.md](docs/LIBRARIES.md) for the full library reference and install commands.

---

## CI/CD

GitHub Actions workflows are located in `.github/workflows/`.

---

## Author

**Nishikant** — [NiskAutomation](https://github.com/NiskAutomation)
