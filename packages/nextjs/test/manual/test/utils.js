module.exports.isSentryRequest = request => {
  return /sentry.io\/api/.test(request.url());
};

module.exports.isStoreRequest = request => {
  return /sentry.io\/api\/\d+\/store/.test(request.url());
};

module.exports.isEnvelopeRequest = request => {
  return /sentry.io\/api\/\d+\/envelope/.test(request.url());
};

module.exports.extractEventFromResponse = response => {
  return JSON.parse(response._request.postData());
};

module.exports.extractEnvelopeFromResponse = response => {
  const [envelopeHeaderString, itemHeaderString, eventString] = response._request.postData().split('\n');

  return {
    envelopeHeader: JSON.parse(envelopeHeaderString),
    itemHeader: JSON.parse(itemHeaderString),
    event: JSON.parse(eventString),
  };
};
