# Playwright Automation Challenge

This repository contains automated tests for the **ViewIQ Demo Application** built with **Playwright**.

The project demonstrates multiple automation approaches used in real QA environments including:

* Page Object Model (POM)
* Hybrid locator framework
* UI + API validation
* Atomic and Fast execution modes
* OTP authentication via Mailosaur

---

# Tech Stack

* **Playwright**
* **Node.js / JavaScript**
* **Mailosaur** – OTP email automation
* **dotenv** – environment variables
* **HTML Reporter**

---

# Project Structure

```
.
├── src
│   ├── pages
│   │   ├── insights.page.js
│   │   ├── login.page.js
│   │   └── locators.ts
│   │
│   └── utils
│       ├── env.js
│       ├── mailosaur.js
│       └── otp.js
│
├── tests
│   ├── channel-insights.test.js
│   ├── channel-insights.pom.test.js
│   ├── video-insights.test.js
│   └── video-insights.pom.test.js
│
├── playwright.atomic.config.js
├── playwright.fast.config.js
├── playwright.config.js
│
├── global-setup.js
├── storageState.json (generated)
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# Installation

Clone the repository and install dependencies.

```bash
npm install
npx playwright install
```

---

# Environment Setup

Create a `.env` file using the example template.

```bash
cp .env.example .env
```

Example configuration:

```
BASE_URL=https://rc.viewiq.com

EMAIL=challenge@xxxx.mailosaur.net
PASSWORD=Password123!

MAILOSAUR_API_KEY=your_api_key
MAILOSAUR_SERVER_ID=your_server_id
```

---

# Running Tests

## Atomic Mode

Each test performs login independently to ensure full test isolation.

```bash
npm run test:atomic
```

---

## Fast Mode

Login is executed once using **global setup**, and the session is reused across all tests using `storageState`.

```bash
npm run test:fast
```

This mode significantly speeds up test execution.

---

# HTML Report

To open the Playwright HTML report:

```bash
npm run report
```

---

# Test Design

Tests are designed to be **atomic** — each test performs login independently to ensure full test isolation.

This approach allows tests to:

* run independently
* run in parallel
* remain stable in CI environments

Additionally, a **Fast execution mode** is provided using shared authentication (`storageState`) to improve performance when isolation is not required.

---

# Implemented Test Scenarios

## 1️⃣ Search Functionality

* Login to the application
* Navigate to **Insights**
* Search for a known influencer (e.g. **"MrBeast"**)
* Assert that the result contains the search term

---

## 2️⃣ Pagination

* Navigate to **Insights → Channels**
* Validate **32 results per page**
* Validate multiple pages

This scenario validates both:

* UI result count
* API response payload

---

## 3️⃣ Filters – Minimum Values

* Open Filters
* Apply **Min values**
* Validate input fields match expected minimum values

Metrics validated:

* CPV
* CPM
* CTR
* CTR-V
* Video View Rate
* Subscribers
* Views
* Views per video

---

## 4️⃣ Suitability Filter + Reset

* Apply **Not Vetted** filter
* Confirm visual indicators
* Reset filters
* Validate default state is restored

---

# Automation Architecture

The project intentionally demonstrates multiple automation approaches.

---

## Page Object Model (POM)

Page classes encapsulate UI interactions.

```
src/pages/login.page.js
src/pages/insights.page.js
```

Benefits:

* cleaner test code
* reusable page logic
* easier maintenance

---

## Hybrid Locator Framework

Some tests use a hybrid locator approach where selectors are separated from test logic.

```
src/pages/locators.ts
```

---

## API + UI Validation

Pagination tests validate both:

* UI results
* API responses

This improves test reliability and ensures UI data matches backend responses.

---

# Authentication Strategy

The application uses **email OTP authentication**.

Automation flow:

1. Login request triggers OTP email
2. Mailosaur API retrieves the message
3. OTP code is extracted automatically
4. OTP is entered in the UI to complete login

---

# Execution Modes

Two execution strategies are implemented.

### Atomic Mode

Each test logs in independently.

Advantages:

* full test isolation
* easier debugging
* reliable parallel execution

---

### Fast Mode

Login runs once and the authenticated session is reused using `storageState`.

Advantages:

* significantly faster execution
* optimized for CI pipelines

---

# CI Ready

The project is designed to run reliably in CI environments.

Tests can run:

* independently (Atomic mode)
* using shared authentication (Fast mode)

Parallel execution is supported via Playwright configuration.

---

# Notes

This project focuses on demonstrating:

* scalable automation architecture
* multiple testing strategies
* realistic QA automation practices

The goal is to showcase **different automation patterns** rather than enforce a single rigid framework design.

---

# Author

Automation challenge implemented using **Playwright**.

The framework demonstrates multiple automation strategies including POM, hybrid locators, API validation, and OTP automation.
