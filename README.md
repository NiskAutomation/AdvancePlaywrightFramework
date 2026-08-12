# 🎭 Advance Playwright Framework

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=238,73,73,255,71,96,255,170,0&height=280&section=header&text=Advance%20Playwright%20Framework&fontSize=50&fontColor=FFFFFF&animation=fadeIn" alt="banner" />
</div>

<div align="center">
  <h3>🚀 Enterprise-Grade End-to-End Testing Framework</h3>
  <p>Built with Playwright, TypeScript, and modern automation best practices</p>
</div>

---

## 📊 Tech Stack & Badges

<div align="center">
  
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

  <br />
  
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)

</div>

<div align="center" style="margin: 20px 0;">
  <div style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:50px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;">
    <span style="width:10px;height:10px;border-radius:50%;background:#fff;display:inline-block;animation:pulse 1.4s infinite;"></span>
    <b>Live Automation Testing</b>
  </div>
</div>

<style>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.85); opacity: 0.7; }
}
</style>

---

## 📋 Overview

**AdvancePlaywrightFramework** is a comprehensive, production-ready End-to-End (E2E) testing framework designed for scalable web application testing. Built on top of Playwright and TypeScript, it provides enterprise-level automation with:

✅ **Page Object Model Architecture** - Reusable and maintainable page abstractions  
✅ **Environment Configuration** - Multi-environment support (QA, Dev, Stage, Prod)  
✅ **Data-Driven Testing** - CSV, Excel, and JSON data utilities  
✅ **Custom HTML Reporting** - Rich reports with screenshots, videos, and traces  
✅ **Comprehensive Logging** - Winston-based logging system  
✅ **Type Safety** - Full TypeScript support with strict typing  
✅ **Browser Automation** - Chromium, Firefox, WebKit support  

---

## 🎯 Key Features

<table align="center">
  <tr>
    <td align="center">
      <h3>🏗️</h3>
      <b>Page Object Model</b><br/>
      Organized, reusable components
    </td>
    <td align="center">
      <h3>⚙️</h3>
      <b>Config Management</b><br/>
      Environment-aware setup
    </td>
    <td align="center">
      <h3>📊</h3>
      <b>Data Handling</b><br/>
      CSV, Excel, JSON support
    </td>
  </tr>
  <tr>
    <td align="center">
      <h3>📈</h3>
      <b>Custom Reporting</b><br/>
      Rich HTML reports
    </td>
    <td align="center">
      <h3>📸</h3>
      <b>Media Capture</b><br/>
      Screenshots & videos
    </td>
    <td align="center">
      <h3>🔍</h3>
      <b>Debugging Tools</b><br/>
      Trace files & logs
    </td>
  </tr>
  <tr>
    <td align="center">
      <h3>🎬</h3>
      <b>Multi-Browser</b><br/>
      Chromium, Firefox, WebKit
    </td>
    <td align="center">
      <h3>📝</h3>
      <b>Type Safety</b><br/>
      Full TypeScript support
    </td>
    <td align="center">
      <h3>🚀</h3>
      <b>Headless & Headed</b><br/>
      Flexible execution modes
    </td>
  </tr>
</table>

---

## 📦 Tech Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **@playwright/test** | ^1.62.1 | E2E Testing Framework |
| **TypeScript** | Latest | Type Safety |
| **@faker-js/faker** | ^10.5.0 | Test Data Generation |
| **winston** | ^3.19.0 | Logging |
| **dotenv** | ^17.4.2 | Environment Configuration |
| **xlsx** | ^0.18.5 | Excel Data Handling |
| **csv-parse** | ^7.0.2 | CSV Data Parsing |
| **ajv** | ^8.20.0 | JSON Schema Validation |
| **allure-playwright** | ^3.10.2 | Allure Reporting |

---

## 📁 Project Structure

```
AdvancePlaywrightFramework/
│
├── 📂 .github/                    # GitHub workflows & CI/CD
├── 📂 docs/                       # Documentation files
├── 📂 logs/                       # Application logs
├── 📂 reports/                    # Test reports
├── 📂 rules/                      # Configuration rules
│
├── 📂 src/
│   ├── 📂 api/                    # API test utilities
│   │   ├── APIClient.ts
│   │   ├── APIEndpoints.ts
│   │   └── APIHelper.ts
│   │
│   ├── 📂 config/                 # Configuration files
│   │   ├── config.ts
│   │   ├── env.ts
│   │   └── constants.ts
│   │
│   ├── 📂 fixtures/               # Playwright fixtures
│   │   └── fixtures.ts
│   │
│   ├── 📂 pages/                  # Page Object Models
│   │   ├── BasePage.ts            # Base page abstraction
│   │   ├── LoginPage.ts           # Login page object
│   │   ├── DashboardPage.ts
│   │   ├── CartPage.ts
│   │   └── ...
│   │
│   ├── 📂 testdata/               # Test data
│   │   ├── testdata.csv
│   │   ├── testdata.json
│   │   └── testdata.xlsx
│   │
│   ├── 📂 tests/                  # Test specifications
│   │   ├── login.spec.ts          # Login test suite
│   │   ├── cart.spec.ts           # Cart test suite
│   │   └── ...
│   │
│   └── 📂 utils/                  # Utility classes
│       ├── logger.ts              # Winston logger
│       ├── CustomReporter.ts      # HTML report generator
│       ├── DataGenerator.ts       # Data generation
│       ├── UtilElementLocator.ts  # Element helpers
│       ├── FileReader.ts
│       └── ValidationHelper.ts
│
├── 📄 .env                        # Environment variables
├── 📄 .gitignore
├── 📄 package.json                # Dependencies & scripts
├── 📄 playwright.config.ts        # Playwright configuration
├── 📄 tsconfig.json               # TypeScript config
├── 📄 README.md                   # This file
│
└── 📂 test-results/               # Playwright test results
    ├── tta-report/                # Custom HTML reports
    └── playwright-report/         # Playwright HTML reports
```

---

## 🛠️ Prerequisites

Before you get started, ensure you have the following installed:

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **npm** ≥ 9.x
- **Git** for version control
- Any modern IDE (VS Code recommended)

### Verify Installation

```bash
node --version    # Should be v18 or higher
npm --version     # Should be 9 or higher
```

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/NiskAutomation/AdvancePlaywrightFramework.git
cd AdvancePlaywrightFramework
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Environment Selection
TEST_ENV=qa

# Base URLs for Different Environments
BASE_URL=https://www.saucedemo.com/
QA_BASE_URL=https://qa-app.thetestingacademy.com
DEV_BASE_URL=https://dev-app.thetestingacademy.com
STAGE_BASE_URL=https://stage-app.thetestingacademy.com
PROD_BASE_URL=https://app.thetestingacademy.com
PROD_API_BASE_URL=https://api.prod.com

# API Configuration
BASE_URL_API=https://restful-booker.herokuapp.com
API_TIMEOUT=30000

# Logging
LOG_LEVEL=info

# Report Configuration
GENERATE_REPORT=true
SCREENSHOT_ON_FAILURE=true
RECORD_VIDEO=true
TRACE_ON_FAILURE=true
```

---

## 🚀 Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test src/tests/login.spec.ts
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode (with browser visible)
```bash
npx playwright test --headed
npx playwright test src/tests/login.spec.ts --project=chromium --headed
```

### Run Tests with Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with Specific Tag
```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

### Run Tests in Parallel/Serial
```bash
npx playwright test --workers=4        # Parallel execution
npx playwright test --workers=1        # Serial execution
```

### View Test Results
```bash
npx playwright show-report
```

---

## ⚙️ Configuration

### Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: 'src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### Environment Variables Support

The framework supports multiple environments:

| Environment | Variable | Example |
|------------|----------|---------|
| QA | `QA_BASE_URL` | https://qa-app.thetestingacademy.com |
| Development | `DEV_BASE_URL` | https://dev-app.thetestingacademy.com |
| Staging | `STAGE_BASE_URL` | https://stage-app.thetestingacademy.com |
| Production | `PROD_BASE_URL` | https://app.thetestingacademy.com |
| Local | `BASE_URL` | http://localhost:3000 |
| API | `BASE_URL_API` | https://api.example.com |

---

## 📊 Custom Reporting

The framework includes a powerful custom HTML reporter located in `src/utils/CustomReporter.ts`.

### Report Features

✨ **Dashboard Summary** - Overall test statistics and metrics  
✨ **Per-Test Details** - Individual test execution information  
✨ **Media Integration** - Links to screenshots, videos, and trace files  
✨ **Status Indicators** - Clear pass/fail/skip status visualization  
✨ **Artifact Links** - Direct access to debug artifacts  
✨ **Live Banner** - Real-time execution indicator  

### Accessing Reports

**Playwright Report:**
```bash
npx playwright show-report
```

**Custom TTA Report:**
Navigate to `tta-report/index.html` in your browser.

---

## 📚 Example Test Suite

### Login Test (`src/tests/login.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BasePage } from '../pages/BasePage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Valid User Login', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Invalid Credentials', async () => {
    await loginPage.login('invalid_user', 'invalid_pass');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username and password do not match');
  });
});
```

---

## 🛠️ Utility Classes & Helpers

### Logger (`src/utils/logger.ts`)

```typescript
import { logger } from '../utils/logger';

logger.info('Test started');
logger.error('An error occurred');
logger.debug('Debug information');
```

### Data Generator (`src/utils/DataGenerator.ts`)

```typescript
import { DataGenerator } from '../utils/DataGenerator';

const testData = {
  name: DataGenerator.generateName(),
  email: DataGenerator.generateEmail(),
  phone: DataGenerator.generatePhone(),
};
```

### Element Locator (`src/utils/UtilElementLocator.ts`)

```typescript
import { UtilElementLocator } from '../utils/UtilElementLocator';

const element = await page.locator(UtilElementLocator.getLoginButton());
await element.click();
```

### Base Page (`src/pages/BasePage.ts`)

```typescript
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    await this.fillText('[name="user-name"]', username);
    await this.fillText('[name="password"]', password);
    await this.click('[type="submit"]');
  }
}
```

---

## 📈 Language Composition

<div align="center">

| Language | Percentage | Status |
|----------|-----------|--------|
| **HTML** | 84.6% | 🟦 |
| **TypeScript** | 15.4% | 🟦 |

```
████████████████████████████████████░░ 84.6% HTML
██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 15.4% TypeScript
```

</div>

---

## 🔧 Advanced Features

### Data-Driven Testing

**CSV Data:**
```bash
# testdata/users.csv
username,password,expected_result
standard_user,secret_sauce,success
invalid_user,wrong_pass,failure
```

**Excel Data:**
```typescript
const excelData = new ExcelReader('testdata/data.xlsx').read();
```

### API Testing

```typescript
import { APIClient } from '../api/APIClient';

const apiClient = new APIClient(baseURL);
const response = await apiClient.get('/users/1');
expect(response.status).toBe(200);
```

### Schema Validation

```typescript
import AJV from 'ajv';
const ajv = new AJV();
const valid = ajv.validate(schema, data);
```

---

## 🐛 Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Trace Files
Trace files are automatically generated on failure and can be viewed:
```bash
npx playwright show-trace test-results/trace.zip
```

### Browser DevTools
```bash
npx playwright test --headed --debug-on-failure
```

### Verbose Logging
Check logs in the `logs/` directory for detailed execution information.

---

## 📦 CI/CD Integration

The framework is ready for GitHub Actions integration. Sample workflow:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🤝 Best Practices

✅ Use Page Object Model for UI interactions  
✅ Keep tests independent and idempotent  
✅ Use descriptive test names  
✅ Follow DRY (Don't Repeat Yourself) principle  
✅ Implement proper error handling  
✅ Use explicit waits instead of sleep  
✅ Maintain test data separately  
✅ Generate meaningful reports  
✅ Version control your tests  
✅ Document complex test scenarios  

---

## 🚨 Troubleshooting

### Issue: Tests timing out
**Solution:** Increase timeout in playwright.config.ts
```typescript
timeout: 60000,  // 60 seconds
```

### Issue: Browser installation fails
**Solution:** Install system dependencies and Playwright
```bash
npx playwright install-deps
npx playwright install
```

### Issue: Port already in use
**Solution:** Kill existing process or change port in .env

### Issue: Elements not found
**Solution:** Check element selectors, add waits, enable debug mode

---

## 📖 Documentation

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [Faker.js](https://fakerjs.dev/)

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Nishikant Pradhan**
- GitHub: [@NiskAutomation](https://github.com/NiskAutomation)
- Repository: [AdvancePlaywrightFramework](https://github.com/NiskAutomation/AdvancePlaywrightFramework)

---

## 🙌 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests

---

## ⭐ Show Your Support

If you find this framework helpful, please consider giving it a ⭐ on GitHub!

---

<div align="center">
  
**Made with ❤️ by NiskAutomation**

[⬆ Back to Top](#-advance-playwright-framework)

</div>
