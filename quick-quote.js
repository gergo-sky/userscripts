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

(async function () {
  "use strict";

  /**
   *
   * Test data
   *
   */

  const TEST_EMAIL = "veyek7193wrawa235a3wss6@locawin.com";
  const TEST_PASSWORD = "test1234";
  const TEST_DOB = "19/09/1972";
  const TEST_POSTCODE = "BB18 5DA";
  const TEST_FIRST_NAME = "DARREN";
  const TEST_LAST_NAME = "ABBAS-soipleave";
  const TEST_MOBILE_NUM = "07123456789";

  /**
   *
   * Constants
   *
   */

  const QUICK_NAV_SELECTOR = '[data-test-id="quick-navigation"]';
  const NEXT_BTN_SELECTOR = '[data-test-id="next-button"]';
  const STANDARD_WAIT = 200;
  const SELECTOR_TIMEOUT = 20000;
  const SELECTOR_WAIT_POLL = 100;
  const WAIT = 50;

  /**
   *
   * Steps
   *
   */

  const SELECT_ADDRESS_STEP = "select-address";
  const NAME_STEP = "name-step";
  const RENT_OWN_STEP = "rent-own";
  const MOVE_IN_STEP = "move-in";
  const HOUSEHOLD_STEP = "household";
  const CLAIMS_STEP = "claims";
  const PAYMENT_SCHEDULE_STEP = "payment-schedule";
  const BEDROOMS_STEP = "bedrooms";
  const COVER_DATE_STEP = "cover-date";
  const ONE_LAST_THING_STEP = "one-last-thing";
  const PRICE_PRESENTATION_STEP = "price-presentation";
  const AGREEMENT_STEP = "agreement";
  const CUSTOMISE_STEP = "customise";
  const POLICY_HOLDER_STEP = "policy-holder";
  const SIGN_IN_STEP = "sign-in";
  const MOBILE_NUMBER_STEP = "mobile-number";

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
   * @returns {void}
   */
  const waitForElements = (selector, timeout, callback) => {
    const startTime = Date.now();

    const checkElements = () => {
      const elements = document.querySelectorAll(selector);

      if (elements.length > 0) {
        callback(elements);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkElements, SELECTOR_WAIT_POLL);
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
      const btn = document.querySelector(selector);

      if (btn && !btn.disabled) {
        callback(btn);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkForBtn, SELECTOR_WAIT_POLL);
      }
    };

    checkForBtn();
  };

  /**
   * Sets input field values that work with React
   *
   * @param {HTMLElement} element
   * @param {string} value
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
   * @returns {Promise<number>}
   */
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  /**
   * @param {string} selector
   * @param {Event | undefined} evt
   * @param {number} timeToWait
   */
  const clickBtn = async (selector, evt = undefined, timeToWait = WAIT) => {
    await delay(timeToWait);

    waitForButton(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {HTMLButtonElement} */ btn) => {
        btn.click();

        if (evt) window.dispatchEvent(evt);
      }
    );
  };

  /**
   * Changes a select element's option.
   *
   * @param {string} selector
   * @param {number} optionIdx
   * @param timeToWait
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

    await delay(timeToWait);
  };

  /**
   * @param {string} selector
   * @param {string} value
   * @param {number} timeToWait
   */
  const fillInputNatively = async (selector, value, timeToWait = WAIT) => {
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

    await delay(timeToWait);
  };

  /**
   * @param {string} selector
   * @param {number} index
   * @param {number} timeToWait
   */
  const clickNthOfMultiple = async (selector, index, timeToWait = WAIT) => {
    waitForElements(
      selector,
      SELECTOR_TIMEOUT,
      (/** @type {HTMLElement} */ elems) => {
        const nthElem = elems?.[index];

        nthElem?.click();
      }
    );

    await delay(timeToWait);
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

  window.addEventListener("load", async () => {
    if (window.location.href.endsWith("/protect/")) {
      await fillInputNatively("#address-postcode-input", TEST_POSTCODE);

      await clickBtn(
        '[data-test-id="postcode-get-started-btn"]',
        new Event(SELECT_ADDRESS_STEP, { bubbles: true })
      );
    } else {
      window.dispatchEvent(new Event(SELECT_ADDRESS_STEP, { bubbles: true }));
    }

    window.dispatchEvent(
      new Event(
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ],
        { bubbles: true }
      )
    );
  });

  window.addEventListener(SELECT_ADDRESS_STEP, async () => {
    await clickNthOfMultiple('[data-test-id="address-list-item"]', 1);

    await clickBtn(QUICK_NAV_SELECTOR, new Event(NAME_STEP, { bubbles: true }));
  });

  window.addEventListener(NAME_STEP, async () => {
    await fillInputNatively(
      '[data-test-id="input-first-name"]',
      TEST_FIRST_NAME
    );

    await fillInputNatively('[data-test-id="input-last-name"]', TEST_LAST_NAME);

    await clickBtn(
      '[data-test-id="next"]',
      new Event(RENT_OWN_STEP, { bubbles: true })
    );
  });

  window.addEventListener(RENT_OWN_STEP, async () => {
    await clickBtn(
      '[aria-labelledby="legend-ownershipStatus"] > div > label:first-child'
    );

    await clickBtn(
      '[aria-labelledby="legend message"] > div > label:first-child'
    );

    await clickBtn(
      '[aria-labelledby="legend-coverType"] > div > label:first-child'
    );

    await clickBtn(
      '[data-test-id="continue"]',
      new Event(MOVE_IN_STEP, { bubbles: true })
    );
  });

  window.addEventListener(MOVE_IN_STEP, async () => {
    await changeSelectIndex("#year-select", 8);

    await clickBtn(
      QUICK_NAV_SELECTOR,
      new Event(HOUSEHOLD_STEP, { bubbles: true })
    );
  });

  window.addEventListener(HOUSEHOLD_STEP, async () => {
    await clickBtn('[data-test-id="radio-household-SingleOccupant"');

    await clickBtn(
      QUICK_NAV_SELECTOR,
      new Event(CLAIMS_STEP, { bubbles: true })
    );
  });

  window.addEventListener(CLAIMS_STEP, async () => {
    await clickBtn('[data-test-id="radio-button-has-claims-no"]');

    await clickBtn(
      NEXT_BTN_SELECTOR,
      new Event(PAYMENT_SCHEDULE_STEP, { bubbles: true })
    );
  });

  window.addEventListener(PAYMENT_SCHEDULE_STEP, async () => {
    await clickBtn('[data-test-id="radio-button-payment-period-InFull"]');

    await clickBtn(
      NEXT_BTN_SELECTOR,
      new Event(BEDROOMS_STEP, { bubbles: true })
    );
  });

  window.addEventListener(BEDROOMS_STEP, async () => {
    await clickBtn('[data-test-id="radio-button-2"]');

    await clickBtn(
      QUICK_NAV_SELECTOR,
      new Event(COVER_DATE_STEP, { bubbles: true })
    );
  });

  window.addEventListener(COVER_DATE_STEP, async () => {
    await clickBtn('[data-test-id="today-button"]');

    await clickBtn(
      '[data-test-id="next"]',
      new Event(ONE_LAST_THING_STEP, { bubbles: true })
    );
  });

  window.addEventListener(ONE_LAST_THING_STEP, async () => {
    await fillInputNatively('[data-test-id="email-input"]', TEST_EMAIL);

    await fillInputNatively('[data-test-id="dob-input"]', TEST_DOB);

    await clickBtn('[data-test-id="email-input"]');

    await clickBtn('[data-test-id="dob-input"]');

    await clickBtn(
      '[data-test-id="show-quote"]',
      new Event(PRICE_PRESENTATION_STEP, { bubbles: true })
    );
  });

  window.addEventListener(PRICE_PRESENTATION_STEP, async () => {
    await clickBtn(
      '[data-test-id="choose-and-customise"]',
      new Event(AGREEMENT_STEP, { bubbles: true })
    );
  });

  window.addEventListener(AGREEMENT_STEP, async () => {
    await clickBtn('[data-test-id="radio-button-assumption-0-true"]');

    await clickBtn('[data-test-id="radio-button-assumption-1-true"]');

    await clickBtn(
      NEXT_BTN_SELECTOR,
      new Event(CUSTOMISE_STEP, { bubbles: true })
    );
  });

  window.addEventListener(CUSTOMISE_STEP, async () => {
    scrollToElem('[data-test-id="summary-cta-button-footer"]');

    await clickBtn(
      '[data-test-id="summary-cta-button-footer"]',
      new Event(POLICY_HOLDER_STEP, { bubbles: true })
    );
  });

  window.addEventListener(POLICY_HOLDER_STEP, async () => {
    await clickBtn('[data-test-id="radio-button-no"]');

    await clickBtn(NEXT_BTN_SELECTOR);
  });

  window.addEventListener(MOBILE_NUMBER_STEP, async () => {
    await fillInputNatively(
      '[data-test-id="mobile-number-input"]',
      TEST_MOBILE_NUM
    );

    await clickBtn('[data-test-id="continue-button"]');
  });
})();
