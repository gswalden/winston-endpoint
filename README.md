[![npm version](https://badge.fury.io/js/winston-endpoint.svg)](https://badge.fury.io/js/winston-endpoint)
[![Build status](https://travis-ci.org/gswalden/winston-endpoint.svg?branch=master)](https://travis-ci.org/gswalden/winston-endpoint)
[![Dependencies](https://david-dm.org/gswalden/winston-endpoint.svg)](https://david-dm.org/gswalden/winston-endpoint)

### Motivation
The HTTP transport included with winston uses a JSON-RPC format, which is not how all log services expect their data. This transport allows a more customizable format.

### Use
Each of the following methods will add this transport to your instance of winston. You may try any of these examples by first creating a RequestBin at https://requestb.in/ and using it in place of the URL below. See the fourth example for an overview of available options.

```js
const winston = require('winston');
const Endpoint = require('winston-endpoint');
winston.add(Endpoint, { url: 'http://requestb.in/1hc2i4h13' });
winston.info('So say we all.');
```

```js
const winston = require('winston');
const Endpoint = require('winston-endpoint');
winston.configure({
  transports: [
    new Endpoint({ url: 'http://requestb.in/1hc2i4h13' })
  ]
});
winston.info('So say we all.');
```

```js
const winston = require('winston');
const Endpoint = require('winston-endpoint');
const logger = new winston.Logger({
  transports: [
    new Endpoint({ url: 'http://requestb.in/1hc2i4h13' })
  ]
})
logger.info('So say we all.');
```

```js
const winston = require('winston');
const Endpoint = require('winston-endpoint');
winston.loggers.add('galatica', {
  endpoint: {
    url: 'http://requestb.in/1hc2i4h13', // endpoint to send logs to (no default)
    json: false, // send the log as a JSON object or a plain string (default: false)
    silent: false, // setting to true will effectively turn this transport off (default: false)
    level: 'info', // the minimum level required to trigger this transport
    prependLevel: true, // when json: false, whether to add the log level to the beginning of the string (default: true)
    appendMeta: true, // when json: false, whether to add the meta data object to the end of the string (default: true)
    http: {} // see below
  }
});
winston.loggers.get('galatica').info('So say we all.');
```

The underlying library for this transport is [got](https://github.com/sindresorhus/got), and you can pass any options it accepts through the `http` field in the options object.

🙃
