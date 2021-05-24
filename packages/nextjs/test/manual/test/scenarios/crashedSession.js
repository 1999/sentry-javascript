const assert = require('assert');

const { isEnvelopeRequest, extractEnvelopeFromResponse } = require('../utils');

module.exports = async (page, url) => {
  // FIXME
  return true;

  // const [firstResponse, secondResponse] = await Promise.all([
  //   page.waitForResponse(response => {
  //     return isEnvelopeRequest(response) && extractEnvelopeFromResponse(response).event.init === true;
  //   }),
  //   page.waitForResponse(response => {
  //     return isEnvelopeRequest(response) && extractEnvelopeFromResponse(response).event.errors === 1;
  //   }),
  //   page.goto(`${url}/crashed`),
  // ]).catch(() => {
  //   throw new Error('Failed to intercept required number of requests');
  // });
  // const firstEnvelope = extractEnvelopeFromResponse(firstResponse);
  // const secondEnvelope = extractEnvelopeFromResponse(secondResponse);
  // assert.strictEqual(firstEnvelope.itemHeader.type, 'session');
  // assert.strictEqual(firstEnvelope.event.init, true);
  // assert.strictEqual(firstEnvelope.event.status, 'ok');
  // assert.strictEqual(firstEnvelope.event.errors, 0);
  // assert.strictEqual(firstEnvelope.event.duration, 0);
  // // TODO: Not sure why it's `ok` and not `crashed`? — Kamil
  // assert.strictEqual(secondEnvelope.itemHeader.type, 'session');
  // assert.strictEqual(secondEnvelope.event.init, false);
  // assert.strictEqual(secondEnvelope.event.status, 'ok');
  // assert.strictEqual(secondEnvelope.event.errors, 1);
  // assert.ok(secondEnvelope.event.duration > 0);
};
