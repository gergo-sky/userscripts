/*

1. Open chrome with debugging enabled

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --incognito

2. Keep one page open

3. Watch for file changes

./watchfiles.sh . "node quick-quote-playwright.js" 0

*/

// TODO replace waits, enable TS.

import { chromium } from "playwright";

const POSTCODE = "BB18 5DA";
const FIRST_NAME = "DARREN";
const LAST_NAME = "ABBAS-soipleave";
const DOB = "19/09/1972";
const EMAIL = "SOg_621195980134_PR@sky.uk";
const PASSWORD = "test1234";
const MOBILE_NUM = "07123456789";

let signedIn = false;

const homePage = async (page) => {
  await page.waitForTimeout(3000);

  const differentAddressBtn = await page.locator(
    '[data-test-id="use-different-address-link"]'
  );

  if (await differentAddressBtn.isVisible()) {
    signedIn = true;

    await differentAddressBtn.click();

    await page.locator("#postcode").fill(POSTCODE);
    await page.locator('[data-test-id="search"]').click();

    await addressStep(page);
  } else {
    await page.locator('[data-test-id="postcode-input"]').fill(POSTCODE);
    await page.locator('[data-test-id="postcode-get-started-btn"]').click();

    await addressStep(page);
  }
};

const addressStep = async (page) => {
  await page
    .locator('[data-test-id="address-list-container"]')
    .locator("li")
    .nth(1)
    .click();

  await page.locator('[data-test-id="quick-navigation"]').click();
};

const nameStep = async (page) => {
  await page.locator('[data-test-id="input-first-name"]').fill(FIRST_NAME);
  await page.locator('[data-test-id="input-last-name"]').fill(LAST_NAME);
  await page.locator('[data-test-id="next"]').first().click();
};

const ownershipStep = async (page) => {
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

const moveInStep = async (page) => {
  await page.locator('[data-test-id="year-select"]').selectOption("2015");
  await page.locator('[data-test-id="quick-navigation"]').click();

  await page
    .locator('[data-test-id="household-questions"] label')
    .first()
    .click();

  await page.locator("#next-btn").first().click();
};

const claimsStep = async (page) => {
  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-has-claims-no"]'),
    })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

const paymentScheduleStep = async (page) => {
  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-payment-period-InFull"]'),
    })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

const bedroomsStep = async (page) => {
  await page
    .locator("label", {
      has: page.locator('[data-test-id="radio-button-2"]'),
    })
    .click();

  await page.locator('[data-test-id="quick-navigation"]').first().click();
};

const coverStartStep = async (page) => {
  await page
    .locator("label", {
      has: page.locator('[data-test-id="today-button"]'),
    })
    .click();

  await page.locator('[data-test-id="next"]').first().click();
};

const emailDobStep = async (page) => {
  await page.locator('[data-test-id="email-input"]').fill(EMAIL);
  await page.locator('[data-test-id="dob-input"]').fill(DOB);
  await page.locator('[data-test-id="show-quote"]').click();
};

const choosePlan = async (page) => {
  await page.locator('[data-test-id="choose-and-customise"]').click();
};

const assumptions = async (page) => {
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

const customise = async (page) => {
  await page.locator('[data-test-id="summary-cta-button-footer"]').click();
};

const policyHolder = async (page) => {
  await page
    .locator("label", { has: page.locator('[data-test-id="radio-button-no"]') })
    .click();

  await page.locator('[data-test-id="next-button"]').first().click();
};

const signIn = async (page) => {
  const signinIframe = page
    .frameLocator('iframe[title="iFrame containing Sky Sign-In application"]')
    .first();

  const passwordInput = signinIframe.locator('[data-testid="PASSWORD__INPUT"]');
  const continueBtn = signinIframe.locator('[data-testid="AUTHN__SUBMIT_BTN"]');

  await passwordInput.fill(PASSWORD);
  await continueBtn.click();
};

const mobileNumber = async (page) => {
  const mobileNumInput = await page.locator("#mobile-number");

  await mobileNumInput.click();
  await mobileNumInput.fill("");
  await mobileNumInput.fill(MOBILE_NUM);

  await page.waitForTimeout(3000);

  await page.locator('[data-test-id="continue-button"]').first().click();
};

(async () => {
  try {
    const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");

    console.log(browser.isConnected() && "Connected to Chrome.");
    console.log(`Contexts in CDP session: ${browser.contexts().length}.`);

    const context = browser.contexts()[0];
    const allPages = context.pages();
    const page = allPages[0];

    page.goto("https://local.bskyb.com:8443/protect/");

    await homePage(page);
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
  } catch (error) {
    console.log("Cannot connect to Chrome.");
  } finally {
    process.exit(0);
  }
})();
