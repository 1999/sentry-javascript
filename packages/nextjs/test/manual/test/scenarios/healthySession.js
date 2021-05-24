const assert = require('assert');

const { isEnvelopeRequest, extractEnvelopeFromResponse } = require('../utils');

module.exports = async (page, url) => {
  const [firstResponse, secondResponse] = await Promise.all([
    page.waitForResponse(response => {
      return isEnvelopeRequest(response) && extractEnvelopeFromResponse(response).event.init === true;
    }),
    page.waitForResponse(response => {
      return isEnvelopeRequest(response) && extractEnvelopeFromResponse(response).event.init === false;
    }),
    page.goto(`${url}/healthy`),
  ]).catch(() => {
    throw new Error('Failed to intercept required number of requests');
  });

  const firstEnvelope = extractEnvelopeFromResponse(firstResponse);
  const secondEnvelope = extractEnvelopeFromResponse(secondResponse);

  assert.strictEqual(firstEnvelope.itemHeader.type, 'session');
  assert.strictEqual(firstEnvelope.event.init, true);
  assert.strictEqual(firstEnvelope.event.status, 'ok');
  assert.strictEqual(firstEnvelope.event.errors, 0);
  assert.strictEqual(firstEnvelope.event.duration, 0);

  assert.strictEqual(secondEnvelope.itemHeader.type, 'session');
  assert.strictEqual(secondEnvelope.event.init, false);
  assert.strictEqual(secondEnvelope.event.status, 'exited');
  assert.strictEqual(secondEnvelope.event.errors, 0);
  assert.ok(secondEnvelope.event.duration > 0);
};
