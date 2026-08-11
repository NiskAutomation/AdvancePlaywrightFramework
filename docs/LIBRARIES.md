# Libraries Used

All libraries are installed as `devDependencies`.

## Install All at Once

```bash
npm install -D @playwright/test @types/node dotenv allure-playwright @faker-js/faker ajv ajv-formats csv-parse jsonpath-plus winston xlsx
```

---

## Library Reference

| Library | Install Command | Purpose |
|---|---|---|
| `@playwright/test` | `npm install -D @playwright/test` | Core Playwright test runner & browser automation |
| `@types/node` | `npm install -D @types/node` | TypeScript types for Node.js built-ins |
| `dotenv` | `npm install -D dotenv` | Load environment variables from `.env` file |
| `allure-playwright` | `npm install -D allure-playwright` | Allure reporting integration for Playwright |
| `@faker-js/faker` | `npm install -D @faker-js/faker` | Generate fake/random test data |
| `ajv` | `npm install -D ajv` | JSON Schema validator (API response validation) |
| `ajv-formats` | `npm install -D ajv-formats` | Additional formats (date, email, uri, etc.) for AJV |
| `csv-parse` | `npm install -D csv-parse` | Parse CSV files for data-driven testing |
| `jsonpath-plus` | `npm install -D jsonpath-plus` | Query JSON responses using JSONPath expressions |
| `winston` | `npm install -D winston` | Logging utility for test execution logs |
| `xlsx` | `npm install -D xlsx` | Read/write Excel files for data-driven testing |

---

## Generate Allure Report

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Run Tests

```bash
# Run all tests
npx playwright test

# Run with specific environment
TT_ENV=qa npx playwright test
TT_ENV=dev npx playwright test
TT_ENV=prod npx playwright test

# Run and open HTML report
npx playwright test --reporter=html
npx playwright show-report
```
