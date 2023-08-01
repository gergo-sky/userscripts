// @ts-check

// ==UserScript==
// @name         Quick Quote Journey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate journey steps
// @author       You
// @match        https://local.bskyb.com:8443/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bskyb.com
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  /**
   *
   * Constants
   *
   */

  /** @type {number} */
  const WAIT = 200;

  /** @type {number} */
  const INITIAL_LOAD_WAIT = 1500;

  /** @type {string} */
  const QUICK_NAV_SELECTOR = '[data-test-id="quick-navigation"]';

  /** @type {string} */
  const NEXT_BTN_SELECTOR = '[data-test-id="next-button"]';

  /**
   *
   * Test data
   *
   */

  /** @type {string} */
  const TEST_EMAIL = "autoft.1675262929861@sky.uk";

  /** @type {string} */
  const TEST_DOB = "19/09/1972";

  /** @type {string} */
  const TEST_POSTCODE = "BB18 5DA";

  /** @type {string} */
  const TEST_FIRST_NAME = "DARREN";

  /** @type {string} */
  const TEST_LAST_NAME = "ABBAS-soipleave";

  /**
   *
   * Helpers
   *
   */

  /**
   * Sets input field values that work with React
   *
   * @param {HTMLElement} element
   * @param {string} value
   * @return {void}
   */
  const setNativeValue = (element, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    )?.set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter?.call(element, value);
    } else {
      valueSetter?.call(element, value);
    }
  };

  /**
   * @param {number} ms
   * @returns {Promise<void>}
   */
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  /**
   * @param {string} selector
   * @param {number} [timeToWait]
   */
  const clickBtn = async (selector, timeToWait = WAIT) => {
    /** @type {HTMLButtonElement | null} */
    const btn = document.querySelector(selector);

    btn?.click();

    await delay(timeToWait);
  };

  /**
   * @param {string} selector
   * @param {number} optionIdx
   * @param {number} timeToWait
   */
  const changeSelectIndex = async (selector, optionIdx, timeToWait = WAIT) => {
    /** @type {HTMLSelectElement | null} */
    const elem = document.querySelector(selector);

    if (elem) elem.selectedIndex = optionIdx;

    await delay(timeToWait);
  };

  /**
   * @param {string} selector
   * @param {string} value
   * @param {number} timeToWait
   */
  const fillInputNatively = async (selector, value, timeToWait = WAIT) => {
    /** @type {HTMLInputElement | null} */
    const inputField = document.querySelector(selector);

    if (inputField) {
      setNativeValue(inputField, value);

      inputField.dispatchEvent(new Event("input", { bubbles: true }));
    }

    await delay(timeToWait);
  };

  /**
   * @param {string} selector
   * @param {number} index
   * @param {number} timeToWait
   */
  const clickNthOfMultiple = async (selector, index, timeToWait = WAIT) => {
    /** @type {NodeListOf<HTMLElement> | null} */
    const elems = document.querySelectorAll(selector);

    const firstElem = elems?.[index];

    firstElem?.click();

    await delay(timeToWait);
  };

  /**
   * @returns {Promise<void>}
   */
  const scrollToElem = async (selector, timeToWait = WAIT) => {
    /** @type {HTMLElement | null} */
    const elem = document.querySelector(selector);

    if (elem) elem.scrollIntoView();

    await delay(timeToWait);
  };

  /**
   *
   * Automation
   *
   */

  // Page 1 - Initial Load

  await delay(INITIAL_LOAD_WAIT);

  await fillInputNatively("#address-postcode-input", TEST_POSTCODE);

  await clickBtn('[data-test-id="postcode-get-started-btn"]', 3000);

  // Page 2 - Select Address from list

  await clickNthOfMultiple('[data-test-id="address-list-item"]', 1);

  await clickBtn(QUICK_NAV_SELECTOR);

  // Page 3 - Name

  await fillInputNatively('[data-test-id="input-first-name"]', TEST_FIRST_NAME);

  await fillInputNatively('[data-test-id="input-last-name"]', TEST_LAST_NAME);

  await clickBtn('[data-test-id="next"]');

  // Page 4 - Rent / Own & Cover

  await clickBtn(
    '[aria-labelledby="legend-ownershipStatus"] > div > label:first-child'
  );

  await clickBtn(
    '[aria-labelledby="legend message"] > div > label:first-child'
  );

  await clickBtn(
    '[aria-labelledby="legend-coverType"] > div > label:first-child'
  );

  await clickBtn('[data-test-id="continue"]');

  // Page 5 - Move in Date

  await changeSelectIndex("#year-select", 8);

  await clickBtn(QUICK_NAV_SELECTOR);

  // Page 6 - Who you live with

  await clickBtn('[data-test-id="radio-household-SingleOccupant"');

  await clickBtn(QUICK_NAV_SELECTOR);

  // // Page 7 - Claims

  // await clickBtn('[data-test-id="radio-button-has-claims-no"]');

  // await clickBtn(NEXT_BTN_SELECTOR);

  // // Page 8 - How do you pay for insurance?

  // await clickBtn('[data-test-id="radio-button-payment-period-InFull"]');

  // await clickBtn(NEXT_BTN_SELECTOR);

  // // Page 9 - Bedrooms

  // await clickBtn('[data-test-id="radio-button-2"]');

  // await clickBtn(QUICK_NAV_SELECTOR);

  // // Page 10 - Cover Date

  // await clickBtn('[data-test-id="today-button"]');

  // await clickBtn('[data-test-id="next"]');

  // // Page 11 - One last thing

  // await fillInputNatively('[data-test-id="email-input"]', TEST_EMAIL);

  // await fillInputNatively('[data-test-id="dob-input"]', TEST_DOB);

  // await clickBtn('[data-test-id="email-input"]');

  // await clickBtn('[data-test-id="dob-input"]');

  // await clickBtn('[data-test-id="show-quote"]', 5000);

  // // Page 12 - Price Presentation

  // await clickBtn('[data-test-id="basic-home-insurance"]');

  // await clickBtn('[data-test-id="choose-and-customise"]');

  // // Page 13 - Aggreement

  // await clickBtn('[data-test-id="radio-button-assumption-0-true"]');

  // await clickBtn('[data-test-id="radio-button-assumption-1-true"]');

  // await clickBtn(NEXT_BTN_SELECTOR, 3000);

  // // Page 14 - Customize

  // await scrollToElem('[data-test-id="upgrade-insurance"]', 1000);

  // await clickBtn('[data-test-id="summary-cta-button-update"]');

  // // Policy holder

  // await clickBtn('[data-test-id="radio-button-no"]');

  // await clickBtn(NEXT_BTN_SELECTOR);
})();
