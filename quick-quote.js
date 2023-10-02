// ==UserScript==
// @name         Quick Quote Journey Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate going through the journey steps
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bskyb.com
// @grant        none
// @require      file:///Users/gdz03/userscripts/quick-quote.js
// ==/UserScript==

// TODO Check if this can be done via playwright by attaching to running chrome instance

(async function () {
  ("use strict");

  /**
   *
   * Test data
   *
   */

  /** @type {string} */
  const TEST_EMAIL = "SOg_621195980134_PR@sky.uk";

  /** @type {string} */
  const TEST_PASSWORD = "test1234";

  /** @type {string} */
  const TEST_DOB = "19/09/1972";

  /** @type {string} */
  const TEST_POSTCODE = "BB18 5DA";

  /** @type {string} */
  const TEST_FIRST_NAME = "DARREN";

  /** @type {string} */
  const TEST_LAST_NAME = "ABBAS-soipleave";

  /** @type {string} */
  const TEST_MOBILE_NUM = "07123456789";

  /**
   *
   * Constants
   *
   */

  /** @type {string} */
  const QUICK_NAV_SELECTOR = '[data-test-id="quick-navigation"]';

  /** @type {string} */
  const NEXT_BTN_SELECTOR = '[data-test-id="next-button"]';

  /** @type {number} */
  const STANDARD_WAIT = 200;

  /** @type {number} */
  const SELECTOR_TIMEOUT = 20000;

  /** @type {number} */
  const SELECTOR_WAIT_POLL = 100;

  /**
   *
   * Helpers
   *
   */

  /**
   * Waits for elements to exist.
   *
   * @param {string} selector
   * @param {number} timeout
   * @param {function} callback
   */
  const waitForElements = (selector, timeout, callback) => {
    const startTime = Date.now();

    const checkElements = () => {
      /** @type {NodeListOf<HTMLElement>} */
      const elements = document.querySelectorAll(selector);

      if (elements.length > 0) {
        callback(elements);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkElements, SELECTOR_WAIT_POLL);
      } else {
        console.error(
          `Timeout exceeded while waiting for elements with selector "${selector}"`
        );
      }
    };

    checkElements();
  };

  /**
   * Waits for a button that is not disabled
   *
   * @param {string} selector
   * @param {number} timeout
   * @param {function} callback
   */
  const waitForButton = (selector, timeout, callback) => {
    const startTime = Date.now();

    const checkForBtn = () => {
      /** @type {HTMLButtonElement | null} */
      const btn = document.querySelector(selector);

      if (btn && !btn.disabled) {
        callback(btn);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkForBtn, SELECTOR_WAIT_POLL);
      } else {
        console.error(
          `Timeout exceeded while waiting for button that is not disabled with selector "${selector}"`
        );
      }
    };

    checkForBtn();
  };

  /**
   * Sets input field values that work with React
   *
   * @param {HTMLElement} element
   * @param {string} value
   * @return {void}
   */
  const setNativeValue = (element, value) => {
    const { set: valueSetter } =
      Object.getOwnPropertyDescriptor(element, "value") || {};
    const prototype = Object.getPrototypeOf(element);
    const { set: prototypeValueSetter } =
      Object.getOwnPropertyDescriptor(prototype, "value") || {};

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      throw new Error("The given element does not have a value setter");
    }
  };

  /**
   * @param {number} ms
   * @returns {Promise<void>}
   */
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  /**
   * @param {string} selector
   */
  const clickBtn = (selector) => {
    waitForButton(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {HTMLButtonElement} */ btn) => btn.click()
    );
  };

  /**
   * Changes a select element's option.
   *
   * @param {string} selector
   * @param {number} optionIdx
   * @returns {Promise<void>}
   */
  const changeSelectIndex = async (
    selector,
    optionIdx,
    timeToWait = STANDARD_WAIT
  ) => {
    waitForElements(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {NodeListOf<HTMLSelectElement>} */ elems) => {
        elems[0].selectedIndex = optionIdx;
      }
    );

    // A delay is needed to correctly populate state.
    // TODO check if this can be avoided.
    await delay(timeToWait);
  };

  /**
   * @param {string} selector
   * @param {string} value
   */
  const fillInputNatively = (selector, value) => {
    waitForElements(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {NodeListOf<HTMLElement>} */ elems) => {
        if (elems) {
          setNativeValue(elems[0], value);

          elems[0].dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    );
  };

  /**
   * @param {string} selector
   * @param {number} index
   */
  const clickNthOfMultiple = (selector, index) => {
    waitForElements(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {HTMLElement} */ elems) => {
        const nthElem = elems?.[index];

        nthElem?.click();
      }
    );
  };

  /**
   * Scrolls element into view.
   *
   * @param {string} selector
   */
  const scrollToElem = (selector) => {
    waitForElements(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {HTMLElement} */ elems) => {
        elems[0].scrollIntoView();
      }
    );
  };

  /**
   *
   * Automation
   *
   */

  // Page 1 - Initial Load

  await delay(2000);

  fillInputNatively("#address-postcode-input", TEST_POSTCODE);

  clickBtn('[data-test-id="postcode-get-started-btn"]');

  // Page 2 - Select Address from list

  clickNthOfMultiple('[data-test-id="address-list-item"]', 1);

  clickBtn(QUICK_NAV_SELECTOR);

  // Page 3 - Name

  fillInputNatively('[data-test-id="input-first-name"]', TEST_FIRST_NAME);

  fillInputNatively('[data-test-id="input-last-name"]', TEST_LAST_NAME);

  clickBtn('[data-test-id="next"]');

  // Page 4 - Rent / Own & Cover

  clickBtn(
    '[aria-labelledby="legend-ownershipStatus"] > div > label:first-child'
  );

  clickBtn('[aria-labelledby="legend message"] > div > label:first-child');

  clickBtn('[aria-labelledby="legend-coverType"] > div > label:first-child');

  clickBtn('[data-test-id="continue"]');

  // Page 5 - Move in Date

  await changeSelectIndex("#year-select", 8, 2000);

  clickBtn(QUICK_NAV_SELECTOR);

  // Page 6 - Who you live with

  clickBtn('[data-test-id="radio-household-SingleOccupant"');

  clickBtn(QUICK_NAV_SELECTOR);

  // Page 7 - Claims

  clickBtn('[data-test-id="radio-button-has-claims-no"]');

  clickBtn(NEXT_BTN_SELECTOR);

  // Page 8 - How do you pay for insurance?

  clickBtn('[data-test-id="radio-button-payment-period-InFull"]');

  clickBtn(NEXT_BTN_SELECTOR);

  // Page 9 - Bedrooms

  clickBtn('[data-test-id="radio-button-2"]');

  clickBtn(QUICK_NAV_SELECTOR);

  // Page 10 - Cover Date

  clickBtn('[data-test-id="today-button"]');

  clickBtn('[data-test-id="next"]');

  // Page 11 - One last thing

  fillInputNatively('[data-test-id="email-input"]', TEST_EMAIL);

  fillInputNatively('[data-test-id="dob-input"]', TEST_DOB);

  clickBtn('[data-test-id="email-input"]');

  clickBtn('[data-test-id="dob-input"]');

  clickBtn('[data-test-id="show-quote"]');

  // Page 12 - Price Presentation

  clickBtn('[data-test-id="choose-and-customise"]');

  // Page 13 - Aggreement

  clickBtn('[data-test-id="radio-button-assumption-0-true"]');

  clickBtn('[data-test-id="radio-button-assumption-1-true"]');

  // Again a delay is needed to wait for state to populate?
  await delay(2000);

  clickBtn(NEXT_BTN_SELECTOR);

  // Page 14 - Customize

  scrollToElem('[data-test-id="summary-cta-button-footer"]');

  clickBtn('[data-test-id="summary-cta-button-footer"]');

  // Policy holder

  clickBtn('[data-test-id="radio-button-no"]');

  clickBtn(NEXT_BTN_SELECTOR);

  // Sign in

  fillInputNatively('[data-testid="PASSWORD__INPUT"]', TEST_PASSWORD);

  clickBtn('[data-testid="AUTHN__SUBMIT_BTN"]');

  // Mobile Number

  fillInputNatively('[data-test-id="mobile-number-input"]', TEST_MOBILE_NUM);

  await delay(12500);

  clickBtn('[data-test-id="continue-button"]');
})();
