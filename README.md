<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Advance%20Playwright%20Framework&fontSize=40&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Enterprise-Grade%20E2E%20Test%20Automation%20%7C%20TypeScript%20%2B%20Playwright&descAlignY=60&descSize=16" />

<br/>

[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/Allure-FF6347?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgo=&logoColor=white)](https://allurereport.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

<br/>

[![GitHub stars](https://img.shields.io/github/stars/NiskAutomation/AdvancePlaywrightFramework?style=social)](https://github.com/NiskAutomation/AdvancePlaywrightFramework/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/NiskAutomation/AdvancePlaywrightFramework?style=social)](https://github.com/NiskAutomation/AdvancePlaywrightFramework/network/members)
[![GitHub issues](https://img.shields.io/github/issues/NiskAutomation/AdvancePlaywrightFramework?color=red)](https://github.com/NiskAutomation/AdvancePlaywrightFramework/issues)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=00D9FF&center=true&vCenter=true&width=600&lines=Page+Object+Model+%F0%9F%93%84;API+%2B+UI+Test+Automation+%F0%9F%9A%80;Multi-Environment+Support+%F0%9F%8C%8D;Allure+%2B+HTML+Reporting+%F0%9F%93%8A;Data-Driven+Testing+%F0%9F%93%91;CI%2FCD+with+GitHub+Actions+%E2%9A%99%EF%B8%8F" alt="Typing SVG" />

</div>

---

## 📁 Project Structure

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

## 🛠️ Tech Stack

<div align="center">

| 🔧 Tool | 📦 Version | 💡 Purpose |
|:---:|:---:|:---|
| [![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/) | `^1.62.1` | Browser automation & test runner |
| [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) | Latest | Typed JavaScript |
| [![Allure](https://img.shields.io/badge/Allure-FF6347?style=flat&logoColor=white)](https://allurereport.org/) | `^3.10.2` | Test reporting |
| [![Faker](https://img.shields.io/badge/Faker.js-FF69B4?style=flat&logoColor=white)](https://fakerjs.dev/) | `^10.5.0` | Random test data generation |
| [![AJV](https://img.shields.io/badge/AJV-23C4C4?style=flat&logoColor=white)](https://ajv.js.org/) | `^8.20.0` | JSON Schema validation |
| [![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=flat&logoColor=black)](https://github.com/motdotla/dotenv) | `^17.4.2` | Environment variable management |
| [![Winston](https://img.shields.io/badge/Winston-231F20?style=flat&logoColor=white)](https://github.com/winstonjs/winston) | `^3.19.0` | Logging |
| [![csv-parse](https://img.shields.io/badge/csv--parse-4CAF50?style=flat&logoColor=white)](https://csv.js.org/parse/) | `^7.0.2` | CSV data-driven testing |
| [![xlsx](https://img.shields.io/badge/xlsx-217346?style=flat&logo=microsoftexcel&logoColor=white)](https://sheetjs.com/) | `^0.18.5` | Excel data-driven testing |
| [![jsonpath-plus](https://img.shields.io/badge/jsonpath--plus-FF9800?style=flat&logoColor=white)](https://github.com/JSONPath-Plus/JSONPath) | `^10.4.0` | JSONPath queries on API responses |

</div>

---

## 🚀 Getting Started

### Prerequisites

![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-%3E%3D9-CB3837?style=flat&logo=npm&logoColor=white)

### Installation

```bash
git clone https://github.com/NiskAutomation/AdvancePlaywrightFramework.git
cd AdvancePlaywrightFramework
npm install
npx playwright install
```

### ⚙️ Environment Setup

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

## ▶️ Running Tests

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

## 📊 Reports

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

## 📚 Libraries

See [docs/LIBRARIES.md](docs/LIBRARIES.md) for the full library reference and install commands.

---

## ⚙️ CI/CD

GitHub Actions workflows are located in `.github/workflows/`.

---

## 👨‍💻 Author

<div align="center">

**Nishikant** — [NiskAutomation](https://github.com/NiskAutomation)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" />

</div>
