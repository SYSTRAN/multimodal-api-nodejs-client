// Copyright (c) 2016 SYSTRAN S.A.

var util = require('util');
var multimodalApi = require('./systran-multimodal-api');

var systranPlatformUrl = 'https://api-platform.systran.net';
var systranApiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

var initOptions = {
  domain: systranPlatformUrl,
  token: {
    value: systranApiKey,
    isQuery: true,
    headerOrQueryName: 'key'
  }
};

exports.parseResponse = function (response, rawData, cb) {
  if (!cb) {cb = rawData; rawData = undefined;}

  if (!response) {
    console.error('Undefined response');
    cb('Undefined response');
    return;
  }

  response.then(function (value) {
    if (value.response)
      console.log('Response statusCode:', value.response.statusCode);

    if (Buffer.isBuffer(value.body) && !rawData)
      value.body = value.body.toString();

    if (typeof value.body === 'object')
      console.log('Response content:', util.inspect(value.body, false, null));
    else
      console.log('Response content:', value.body);

    cb(null, value.response, value.body);
  }, function (reason) {
    if (reason.response)
      console.error('reason.response.statusCode', reason.response.statusCode);

    if (reason.body)
      console.error('reason.body', reason.body);

    if (!reason.response && !reason.body)
      console.error('reason', reason);

    cb(reason);
  });
};

exports.multimodalClient = new multimodalApi.SystranMultimodalApi(initOptions);