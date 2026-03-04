# Playwright Automation Challenge

This repository contains automated tests for the **ViewIQ Demo Application** built with **Playwright**.

The project demonstrates different automation approaches used in real QA environments including:

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
├── storageState.json
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

---

# Installation

Clone the repository and install dependencies:

```bash
npm install
npx playwright install
```

---

# Environment Setup

Create a `.env` file using the example template:

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

Each test performs login independently.

```bash
npm run test:atomic
```

---

## Fast Mode

Login is executed once using **global setup**, and the session is reused for all tests.

```bash
npm run test:fast
```

---

# HTML Report

To open the Playwright HTML report:

```bash
npm run report
```

---

# Implemented Test Scenarios

## 1️⃣ Search Functionality

* Login to the application
* Navigate to **Insights**
* Search for a channel
* Validate search results

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

Some tests use a hybrid locator approach.

```
src/pages/locators.ts
```

This pattern separates selectors from test logic.

---

## API + UI Validation

Pagination tests validate:

* UI results
* API responses

This ensures stronger test reliability.

---

# Authentication Strategy

The application uses **email OTP authentication**.

Automation flow:

1. Login triggers OTP email
2. Mailosaur API retrieves the email
3. OTP code is extracted
4. OTP is automatically entered in the UI

---

# Execution Modes

Two execution strategies are implemented.

### Atomic Mode

Each test logs in independently.

Advantages:

* complete test isolation
* easier debugging

---

### Fast Mode

Login runs once and session is reused using `storageState`.

Advantages:

* faster execution
* suitable for CI pipelines

---

# Notes

This project focuses on demonstrating:

* scalable automation architecture
* multiple testing strategies
* realistic QA automation practices

The goal is to showcase **different automation patterns** rather than enforce a single framework design.

---
