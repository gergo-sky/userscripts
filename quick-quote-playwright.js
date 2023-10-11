/*

1. Open chrome with debugging enabled

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --incognito

2. Keep one page open

3. Watch for file changes

./watchfiles.sh . "node quick-quote-playwright.js" 0

*/

import { chromium } from "playwright";

/** @typedef { import('playwright').Page } Page */

const POSTCODE = "BB18 5DA";
const FIRST_NAME = "DARREN";
const LAST_NAME = "ABBAS-soipleave";
const DOB = "19/09/1972";
const EMAIL = "SOg_621195980134_PR@sky.uk";
const PASSWORD = "test1234";
const MOBILE_NUM = "07123456789";

let signedIn = false;

const logColorSuccess = "\x1b[32m";
const logColorInfo = "\x1b[33m";
const logColorError = "\x1b[31m";

/**
 * @param {Page} page
 */
const homePage = async (page) => {
  console.log(logColorInfo, "Home");

  await page.waitForLoadState("networkidle");

  const differentAddressBtn = page.locator(
    '[data-test-id="use-different-address-link"]'
  );

  if (await differentAddressBtn.isVisible()) {
    signedIn = true;

    await differentAddressBtn.click();

    await page.locator("#postcode").fill(POSTCODE);
    await page.locator('[data-test-id="search"]').click();
  } else {
    await page.locator('[data-test-id="postcode-input"]').fill(POSTCODE);
    await page.locator('[data-test-id="postcode-get-started-btn"]').click();
  }
};

/**
 * @param {Page} page
 */
const addressStep = async (page) => {
  console.log(logColorInfo, "Address Step");

  await page
    .locator('[data-test-id="address-list-container"]')
    .locator("li")
    .nth(1)
    .click();

  await page.locator('[data-test-id="quick-navigation"]').click();
};

/**
 * @param {Page} page
 */
const nameStep = async (page) => {
  console.log(logColorInfo, "Name Step");

  await page.locator('[data-test-id="input-first-name"]').fill(FIRST_NAME);
  await page.locator('[data-test-id="input-last-name"]').fill(LAST_NAME);
  await page.locator('[data-test-id="next"]').first().click();
};

/**
 * @param {Page} page
 */
const ownershipStep = async (page) => {
  console.log(logColorInfo, "Ownership Step");

  await page
    .locator(
      '[aria-labelledby="legend-ownershipStatus"] > div > label:first-child'
    )
    .click();

  await page
    .locator('[aria-labelledby="legend message"] > div > label:first-child')
    .click();

  await page
    .locator('[aria-labelledby="legend-coverType"] > div > label:first-child')
    .click();

  await page.locator('[data-test-id="continue"]').click();
};

/**
 * @param {Page} page
 */
const moveInStep = async (page) => {
  console.log(logColorInfo, "Move In Date Step");

  await page.locator('[data-test-id="year-select"]').selectOption("2015");

  await page
    .locator(
      '[data-test-id="time-at-address-step"] [data-test-id="quick-navigation"]'
    )
    .click();

  await page
    .locator('[data-test-id="household-questions"] label')
    .first()
    .click();

  await page.locator("#next-btn").first().click();
};

/**
 * @param {Page} page
 */
const claimsStep = async (page) => {
  console.log(logColorInfo, "Claims Step");

  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-has-claims-no"]'),
    })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

/**
 * @param {Page} page
 */
const paymentScheduleStep = async (page) => {
  console.log(logColorInfo, "Payment Schedule Step");

  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-payment-period-InFull"]'),
    })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

/**
 * @param {Page} page
 */
const bedroomsStep = async (page) => {
  console.log(logColorInfo, "Bedrooms Step");

  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-2"]'),
    })
    .click();

  await page.locator('[data-test-id="quick-navigation"]').first().click();
};

/**
 * @param {Page} page
 */
const coverStartStep = async (page) => {
  console.log(logColorInfo, "Cover Start Date Step");

  await page
    .locator("label", {
      has: page.locator('[data-test-id="today-button"]'),
    })
    .click();

  await page.locator('[data-test-id="next"]').first().click();
};

/**
 * @param {Page} page
 */
const emailDobStep = async (page) => {
  console.log(logColorInfo, "Email & DOB Step");

  await page.locator('[data-test-id="email-input"]').fill(EMAIL);
  await page.locator('[data-test-id="dob-input"]').fill(DOB);
  await page.locator('[data-test-id="show-quote"]').click();
};

/**
 * @param {Page} page
 */
const choosePlan = async (page) => {
  console.log(logColorInfo, "Choose Plan Page");

  await page.locator('[data-test-id="choose-and-customise"]').click();
};

/**
 * @param {Page} page
 */
const assumptions = async (page) => {
  console.log(logColorInfo, "Assumptions Page");

  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-assumption-0-true"]'),
    })
    .click();

  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-assumption-1-true"]'),
    })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

/**
 * @param {Page} page
 */
const customise = async (page) => {
  console.log(logColorInfo, "Customise Page");

  await page.locator('[data-test-id="summary-cta-button-footer"]').click();
};

/**
 * @param {Page} page
 */
const policyHolder = async (page) => {
  console.log(logColorInfo, "Policy Holder Page");

  await page
    .locator("label", { has: page.locator('[data-test-id="radio-button-no"]') })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

/**
 * @param {Page} page
 */
const signIn = async (page) => {
  console.log(logColorInfo, "Sign In Page");

  const signinIframe = page
    .frameLocator('iframe[title="iFrame containing Sky Sign-In application"]')
    .first();

  const passwordInput = signinIframe.locator('[data-testid="PASSWORD__INPUT"]');
  const continueBtn = signinIframe.locator('[data-testid="AUTHN__SUBMIT_BTN"]');

  await passwordInput.fill(PASSWORD);
  await continueBtn.click();
};

/**
 * @param {Page} page
 */
const mobileNumber = async (page) => {
  console.log(logColorInfo, "Mobile Number Page");

  const mobileNumInput = page.locator("#mobile-number");

  await mobileNumInput.click();
  await mobileNumInput.fill("");
  await mobileNumInput.fill(MOBILE_NUM);

  await page.waitForLoadState("networkidle");

  await page.locator('[data-test-id="continue-button"]').first().click();
};

(async () => {
  try {
    const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");

    console.log(browser.isConnected() && "Connected to Chrome");
    console.log(`Contexts in CDP session: ${browser.contexts().length}`);

    const context = browser.contexts()[0];
    const allPages = context.pages();
    const page = allPages[0];

    page.goto("https://local.bskyb.com:8443/protect/");

    page.setDefaultTimeout(10000);

    await homePage(page);
    await addressStep(page);
    await nameStep(page);
    await ownershipStep(page);
    await moveInStep(page);
    await claimsStep(page);
    await paymentScheduleStep(page);
    await bedroomsStep(page);
    await coverStartStep(page);
    await emailDobStep(page);
    await choosePlan(page);
    await assumptions(page);
    await customise(page);
    await policyHolder(page);
    !signedIn && (await signIn(page));
    await mobileNumber(page);

    console.log(logColorSuccess, "Journey completed");
  } catch (error) {
    console.log(logColorError, error);
  } finally {
    process.exit(0);
  }
})();
