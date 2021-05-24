const assert = require('assert');

const { isStoreRequest, extractEventFromResponse } = require('../utils');

module.exports = async (page, url) => {
  await page.goto(`${url}/button`);

  const [response] = await Promise.all([page.waitForResponse(isStoreRequest), page.click('button')]).catch(() => {
    throw new Error('Failed to intercept required number of requests');
  });

  const event = extractEventFromResponse(response);
  const { type, value } = event.exception.values[0];

  assert.strictEqual(type, 'Error');
  assert.strictEqual(value, 'Sentry Frontend Error');
};
