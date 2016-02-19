// Copyright (c) 2016 SYSTRAN S.A.

var fs = require('fs');
var path = require('path');
var setup = require('../setup');

describe('Speech recognition', function() {
  this.timeout(60000);
  describe('Get api version', function() {
    it('should get api version without error', function(done) {
      var result = setup.multimodalClient.getMultimodalApiVersion();
      setup.parseResponse(result, done);
    });
  });

  describe('Get supported languages', function() {
    it('should get list of supported languages without error', function(done) {
      var result = setup.multimodalClient.getMultimodalSpeechSupportedLanguages();
      setup.parseResponse(result, done);
    });
  });

  describe('Detect languages from an audio file', function() {
    it('should detect languages from an audio file without error', function(done) {
      var audioFile = fs.createReadStream(path.join(__dirname, 'test.mp3'));
      var result = setup.multimodalClient.postMultimodalSpeechDetectLanguage({audioFile: audioFile});
      setup.parseResponse(result, done);
    });
  });

  describe('Transcribe an audio file', function() {
    it('should get text from an audio file without error', function(done) {
      var lang = 'en';
      var model = 'eng';
      var audioFile = fs.createReadStream(path.join(__dirname, 'test.mp3'));
      var result = setup.multimodalClient.postMultimodalSpeechTranscribe({audioFile: audioFile, lang: lang, model: model});
      setup.parseResponse(result, done);
    });
  });

  describe('Align text with an audio file', function() {
    it('should align text with an audio file without error', function(done) {
      var lang = 'en';
      var model = 'eng';
      var audioFile = fs.createReadStream(path.join(__dirname, 'test.mp3'));
      var textFile = fs.createReadStream(path.join(__dirname, 'test_mp3.txt'));
      var result = setup.multimodalClient.postMultimodalSpeechAlign({audioFile: audioFile, textFile: textFile, lang: lang, model: model});
      setup.parseResponse(result, done);
    });
  });

  describe('Segment an audio file', function() {
    it('should segment an audio file without error', function(done) {
      var lang = 'en';
      var model = 'eng';
      var audioFile = fs.createReadStream(path.join(__dirname, 'test.mp3'));
      var result = setup.multimodalClient.postMultimodalSpeechSegment({audioFile: audioFile, lang: lang, model: model});
      setup.parseResponse(result, done);
    });
  });
});