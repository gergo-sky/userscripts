// @ts-check

// ==UserScript==
// @name         Quick Quote Journey GitHub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate journey steps
// @author       You
// @match        https://local.bskyb.com:8443/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bskyb.com
// @grant        none
// @require      file:///Users/gdz03/userscripts/quick-quote.js
// ==/UserScript==

(async function () {
  ("use strict");

  /**
   *
   * Constants
   *
   */

  /** @type {number} */
  const WAIT = 200;

  /** @type {number} */
  const SELECTOR_TIMEOUT = 10000;

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
        setTimeout(checkElements, 100);
      } else {
        console.error(
          `Timeout exceeded while waiting for elements "${selector}"`
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
        setTimeout(checkForBtn, 100);
      } else {
        console.error(
          `Timeout exceeded while waiting for button "${selector}"`
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
   */
  const clickBtn = (selector) => {
    waitForButton(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {HTMLButtonElement} */ btn) => btn.click()
    );
  };

  /**
   * @param {string} selector
   * @param {number} optionIdx
   */
  const changeSelectIndex = async (selector, optionIdx, timeToWait = WAIT) => {
    waitForElements(selector, SELECTOR_TIMEOUT, (elems) => {
      elems[0].selectedIndex = optionIdx;
    });

    // TODO Remove delay if possible
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
        const firstElem = elems?.[index];

        firstElem?.click();
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

  await delay(2000);

  clickBtn(NEXT_BTN_SELECTOR);

  // Page 14 - Customize

  scrollToElem('[data-test-id="summary-cta-button-footer"]');

  clickBtn('[data-test-id="summary-cta-button-footer"]');

  // Policy holder

  clickBtn('[data-test-id="radio-button-no"]');

  clickBtn(NEXT_BTN_SELECTOR);
})();
