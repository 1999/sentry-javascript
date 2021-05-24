const fs = require('fs').promises;

const puppeteer = require('puppeteer');

const { isEnvelopeRequest, isSentryRequest, isStoreRequest } = require('./utils');

// TODO: Node.js strategy
// TODO: Change port to random

/**
 * Tests:
 *
 * Errors:
 * - [DONE] capture errors for clicks
 * - API route + page route errors
 *
 * Tracing:
 * - navigate between dynamic routes (parametrized) - navigate between pages and assert on delivered transactions
 *   (pageload + transaction per navigation) - assert on dynamic routing names
 * - spans from outgoing http requests (browser + node)
 * - dont sent transactions for `_next/` urls
 * - dont create transactions for `public/` static resources (node)
 *
 * Sessions:
 * - [DONE] send healthy sessions by default (browser, but not node)
 * - send broken sessions by default (browser, but not node)
 */

const PORT = 3000;
const TEST_URL = `http://localhost:${PORT}`;

const DEBUG = false;

(async () => {
  const browser = await puppeteer.launch({
    devtools: false,
  });

  const scenarios = await fs.readdir('./scenarios');

  const cases = scenarios.map(async testCase => {
    const page = await browser.newPage();
    page.setDefaultTimeout(2000);
    page.on('console', msg => console.log(msg.text()));

    await page.setRequestInterception(true);
    page.on('request', request => {
      if (isSentryRequest(request)) {
        if (DEBUG) console.log('Sentry request intercepted.');

        request.respond({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: '',
        });
      } else {
        request.continue();
      }

      if (isStoreRequest(request)) {
        if (DEBUG) console.log('Store request intercepted.');
      }

      if (isEnvelopeRequest(request)) {
        if (DEBUG) console.log('Envelope request intercepted.');
      }
    });

    return require(`./scenarios/${testCase}`)(page, TEST_URL).then(
      () => {
        console.log(`\x1b[32m✓ Test Succeded: ${testCase}\x1b[0m`);
        return true;
      },
      error => {
        console.log(`\x1b[31mX Test Failed: ${testCase}\x1b[0m\n${error.message}`);
        return false;
      },
    );
  });

  const success = (await Promise.all(cases)).every(Boolean);

  await browser.close();

  if (success) {
    console.log(`\x1b[32m✓ All Tests Succeded\x1b[0m`);
    process.exit(0);
  } else {
    console.log(`\x1b[31mX Some Tests Failed\x1b[0m`);
    process.exit(1);
  }
})();
