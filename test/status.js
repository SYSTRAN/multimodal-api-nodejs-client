// Copyright (c) 2016 SYSTRAN S.A.

var setup = require('../setup');

before(function(done) {
  this.timeout(10000);
  var result = setup.multimodalClient.getMultimodalApiVersion();
  setup.parseResponse(result, function(err) {
    if (err) {
      console.error('Unable to get api version. Please verify your apiKey or retry later');
      done(new Error(err));
    }
    else {
      done();
    }
  });
});
