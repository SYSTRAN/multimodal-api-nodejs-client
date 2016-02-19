// Copyright (c) 2016 SYSTRAN S.A.

var fs = require('fs');
var path = require('path');
var setup = require('../setup');

describe('File operations', function() {
  this.timeout(60000);
  describe('Get supported file formats', function() {
    it('should get list of supported file formats without error', function(done) {
      var result = setup.multimodalClient.getMultimodalFileSupportedFormats();
      setup.parseResponse(result, done);
    });
  });

  describe('Extract text from a file', function() {
    it('should extract text from a file without error', function(done) {
      var inputFile = fs.createReadStream(path.join(__dirname, 'extract_test.html'));
      var result = setup.multimodalClient.postMultimodalFileExtractText({inputFile: inputFile});
      setup.parseResponse(result, done);
    });

    it('should extract text from a file with specific lang', function(done) {
      var lang = 'en';
      var inputFile = fs.createReadStream(path.join(__dirname, 'extract_test.html'));
      var result = setup.multimodalClient.postMultimodalFileExtractText({inputFile: inputFile, lang: lang});
      setup.parseResponse(result, done);
    });

    it('should extract text from a file with specific lang and format', function(done) {
      var lang = 'en';
      var format = 'text/html';
      var inputFile = fs.createReadStream(path.join(__dirname, 'extract_test.html'));
      var result = setup.multimodalClient.postMultimodalFileExtractText({inputFile: inputFile, lang: lang, format: format});
      setup.parseResponse(result, done);
    });
  });
});