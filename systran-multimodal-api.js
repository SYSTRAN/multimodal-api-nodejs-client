// Copyright (c) 2016 SYSTRAN S.A.

/*jshint -W069 */
/**
 * ### Introduction

REST API to use the Multimodal features: Speech recognition, Image Processing, Text extraction.

### Cross Domain

Multimodal API supports cross-domain requests through the JSONP or the CORS mechanism.

Multimodal API also supports the Silverlight client access policy file (clientaccesspolicy.xml) and the Adobe Flash cross-domain policy file (crossdomain.xml) that handles cross-domain requests.

#### JSONP Support

Multimodal API supports JSONP by providing the name of the callback function as a parameter. The response body will be contained in the parentheses:

```javascript
callbackFunctionName(/* response body as defined in each API section *\/);
```

For example for a supportedLanguages call with the callback set to supportedLanguagesCallback the response body will be similar to the following:

```javascript
supportedLanguagesCallback({
  "languages": [
     {
         "lang": "en", /* language *\/
         "model": "eng", /* model *\/
     }
  ]
});
```

#### CORS

Multimodal API supports the CORS mechanism to handle cross-domain requests. The server will correctly handle the OPTIONS requests used by CORS.

The following headers are set as follows:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: X-Requested-With,Content-Type,X-HTTP-METHOD-OVERRIDE
```

### Langage Code Values

The language codes to be used are the two-letter codes defined by the ISO 639-1:2002, Codes for the representation of names of languages - Part 1: Alpha-2 code standard.

Refer to the column 'ISO 639-1 code' of this list: http://www.loc.gov/standards/iso639-2/php/code_list.php.

In addition to this list, the following codes are used:

Language Code |	Language
--------------|---------
auto | Language Detection
tj | Tajik (cyrillic script)
zh-Hans | Chinese (Simplified)
zh-Hant |	Chinese (Traditional)

### Audio files

For an API accepting an audio file, the following formats are supported (all single track):
- AIFF
- ASF/WMA
- FLAC
- MS-Wave
- MPEG
- Ogg/Vorbis

The maximum accepted audio file size is 110M bytes.

### Mobile API keys

** iOS **: If you use an iOS API key, you need to add the following parameter to each request:
* `bundleId`: Your application bundle ID

<br />

** Android **: If you use an Android API key, you need to add the following parameters to each request:
* `packageName`: Your application package name
* `certFingerprint`: Your application certificate fingerprint

 * @class SystranMultimodalApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var SystranMultimodalApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function SystranMultimodalApi(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.token = (typeof options === 'object') ? (options.token ? options.token : {}) : {};
    }

    /**
     * Set Token
     * @method
     * @name SystranMultimodalApi#setToken
     * @param {string} value - token's value
     * @param {string} headerOrQueryName - the header or query name to send the token at
     * @param {boolean} isQuery - true if send the token as query param, otherwise, send as header param
     *
     */
    SystranMultimodalApi.prototype.setToken = function(value, headerOrQueryName, isQuery) {
        this.token.value = value;
        this.token.headerOrQueryName = headerOrQueryName;
        this.token.isQuery = isQuery;
    };

    /**
     * Get text from an audio file.

     * @method
     * @name SystranMultimodalApi#postMultimodalSpeechTranscribe
     * @param {file} audioFile - Audio file ([details](#description_audio_files)).

     * @param {string} lang - Language code of the input ([details](#description_langage_code_values))
     * @param {string} model - Model name. (Advanced usage: Models can be specifically designed for a particular user application. Please contact SYSTRAN Team form more information on how to get a specific model for a language, dialect, or use case).  

     * @param {string} sampling - Sampling quality of the audio file.
     * high: wide band audio such as radio and TV broadcast (sampling higher or equal to 16KHz)
     * low: telephone data with sampling rates higher or equal to 8KHz. It is highly recommended to not use a bit rate lower than 32Kbps.

     * @param {integer} maxSpeaker - Maximum number of speakers. Default 1 for low sampling and infinity for high sampling
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalSpeechTranscribe = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/speech/transcribe';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['audioFile'] !== undefined) {
            form['audioFile'] = parameters['audioFile'];
        }

        if (parameters['audioFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: audioFile'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['lang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: lang'));
            return deferred.promise;
        }

        if (parameters['model'] !== undefined) {
            queryParameters['model'] = parameters['model'];
        }

        if (parameters['sampling'] !== undefined) {
            queryParameters['sampling'] = parameters['sampling'];
        }

        if (parameters['maxSpeaker'] !== undefined) {
            queryParameters['maxSpeaker'] = parameters['maxSpeaker'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Align text and audio files. Only Dutch (nl), French (fr), English (en), German (de), Italian (it) and Spanish (es) languages are supported. 

     * @method
     * @name SystranMultimodalApi#postMultimodalSpeechAlign
     * @param {file} audioFile - Audio file ([details](#description_audio_files)).

     * @param {file} textFile - Plain text file, ASCII, ISO-8859 or UTF8 encoded.

    The text should include one sentence or clause per line ending with a punctuation mark.

     * @param {string} lang - Language code of the input ([details](#description_langage_code_values))
     * @param {string} model - Model name. (Advanced usage: Models can be specifically designed for a particular user application. Please contact SYSTRAN Team form more information on how to get a specific model for a language, dialect, or use case).  

     * @param {string} sampling - Sampling quality of the audio file.
     * high: wide band audio such as radio and TV broadcast (sampling higher or equal to 16KHz)
     * low: telephone data with sampling rates higher or equal to 8KHz. It is highly recommended to not use a bit rate lower than 32Kbps.

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalSpeechAlign = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/speech/align';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['audioFile'] !== undefined) {
            form['audioFile'] = parameters['audioFile'];
        }

        if (parameters['audioFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: audioFile'));
            return deferred.promise;
        }

        if (parameters['textFile'] !== undefined) {
            form['textFile'] = parameters['textFile'];
        }

        if (parameters['textFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: textFile'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['lang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: lang'));
            return deferred.promise;
        }

        if (parameters['model'] !== undefined) {
            queryParameters['model'] = parameters['model'];
        }

        if (parameters['sampling'] !== undefined) {
            queryParameters['sampling'] = parameters['sampling'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Segment an audio file.

     * @method
     * @name SystranMultimodalApi#postMultimodalSpeechSegment
     * @param {file} audioFile - Audio file ([details](#description_audio_files)).

     * @param {string} sampling - Sampling quality of the audio file.
     * high: wide band audio such as radio and TV broadcast (sampling higher or equal to 16KHz)
     * low: telephone data with sampling rates higher or equal to 8KHz. It is highly recommended to not use a bit rate lower than 32Kbps.

     * @param {integer} maxSpeaker - Maximum number of speakers. Default 1 for low sampling and infinity for high sampling
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalSpeechSegment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/speech/segment';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['audioFile'] !== undefined) {
            form['audioFile'] = parameters['audioFile'];
        }

        if (parameters['audioFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: audioFile'));
            return deferred.promise;
        }

        if (parameters['sampling'] !== undefined) {
            queryParameters['sampling'] = parameters['sampling'];
        }

        if (parameters['maxSpeaker'] !== undefined) {
            queryParameters['maxSpeaker'] = parameters['maxSpeaker'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Detect languages from an audio file.

     * @method
     * @name SystranMultimodalApi#postMultimodalSpeechDetectLanguage
     * @param {file} audioFile - Audio file ([details](#description_audio_files)).

     * @param {string} sampling - Sampling quality of the audio file.
     * high: wide band audio such as radio and TV broadcast (sampling higher or equal to 16KHz)
     * low: telephone data with sampling rates higher or equal to 8KHz. It is highly recommended to not use a bit rate lower than 32Kbps.

     * @param {integer} maxSpeaker - Maximum number of speakers. Default 1 for low sampling and infinity for high sampling
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalSpeechDetectLanguage = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/speech/detectLanguage';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['audioFile'] !== undefined) {
            form['audioFile'] = parameters['audioFile'];
        }

        if (parameters['audioFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: audioFile'));
            return deferred.promise;
        }

        if (parameters['sampling'] !== undefined) {
            queryParameters['sampling'] = parameters['sampling'];
        }

        if (parameters['maxSpeaker'] !== undefined) {
            queryParameters['maxSpeaker'] = parameters['maxSpeaker'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List of languages in which Speech is supported.

     * @method
     * @name SystranMultimodalApi#getMultimodalSpeechSupportedLanguages
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.getMultimodalSpeechSupportedLanguages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/speech/supportedLanguages';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Analyze the layout of an image.

     * @method
     * @name SystranMultimodalApi#postMultimodalImageAnalyzeLayout
     * @param {file} imageFile - Image file
     * @param {string} lang - Language code of the input ([details](#description_langage_code_values))
     * @param {integer} profile - Profile id

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalImageAnalyzeLayout = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/image/analyze/layout';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['imageFile'] !== undefined) {
            form['imageFile'] = parameters['imageFile'];
        }

        if (parameters['imageFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: imageFile'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['lang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: lang'));
            return deferred.promise;
        }

        if (parameters['profile'] !== undefined) {
            queryParameters['profile'] = parameters['profile'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Analyze the region properties of an image.

     * @method
     * @name SystranMultimodalApi#postMultimodalImageAnalyzeRegion
     * @param {file} imageFile - Image file
     * @param {string} lang - Language code of the input ([details](#description_langage_code_values))
     * @param {integer} profile - Profile id

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalImageAnalyzeRegion = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/image/analyze/region';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['imageFile'] !== undefined) {
            form['imageFile'] = parameters['imageFile'];
        }

        if (parameters['imageFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: imageFile'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['lang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: lang'));
            return deferred.promise;
        }

        if (parameters['profile'] !== undefined) {
            queryParameters['profile'] = parameters['profile'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Transcribe text from an image.

     * @method
     * @name SystranMultimodalApi#postMultimodalImageTranscribe
     * @param {file} imageFile - Image file
     * @param {string} lang - Language code of the input ([details](#description_langage_code_values))
     * @param {integer} profile - Profile id

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalImageTranscribe = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/image/transcribe';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['imageFile'] !== undefined) {
            form['imageFile'] = parameters['imageFile'];
        }

        if (parameters['imageFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: imageFile'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['lang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: lang'));
            return deferred.promise;
        }

        if (parameters['profile'] !== undefined) {
            queryParameters['profile'] = parameters['profile'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List of languages in which Image processing is supported.
     * @method
     * @name SystranMultimodalApi#getMultimodalImageSupportedLanguages
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.getMultimodalImageSupportedLanguages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/image/supportedLanguages';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Extract text from a file.

     * @method
     * @name SystranMultimodalApi#postMultimodalFileExtractText
     * @param {file} inputFile - Input File
     * @param {string} lang - Language code of the input ([details](#description_langage_code_values)) or `auto` for automatic detection
     * @param {string} format - Format of the input file.

    Valid values are the mimetypes returned by the supportedFormats service.

     * @param {integer} profile - Profile id

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.postMultimodalFileExtractText = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/file/extract/text';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['inputFile'] !== undefined) {
            form['inputFile'] = parameters['inputFile'];
        }

        if (parameters['inputFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: inputFile'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['format'] !== undefined) {
            queryParameters['format'] = parameters['format'];
        }

        if (parameters['profile'] !== undefined) {
            queryParameters['profile'] = parameters['profile'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get a list of supported file formats.

     * @method
     * @name SystranMultimodalApi#getMultimodalFileSupportedFormats
     * @param {integer} profile - Profile id

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.getMultimodalFileSupportedFormats = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/file/supportedFormats';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['profile'] !== undefined) {
            queryParameters['profile'] = parameters['profile'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Current version for multimodal apis

     * @method
     * @name SystranMultimodalApi#getMultimodalApiVersion
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranMultimodalApi.prototype.getMultimodalApiVersion = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/multimodal/apiVersion';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };

    return SystranMultimodalApi;
})();

exports.SystranMultimodalApi = SystranMultimodalApi;