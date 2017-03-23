'use strict';

const got = require('got');
const util = require('util');
const winston = require('winston');

const Endpoint = winston.transports.Endpoint = function Endpoint(opt) {
  opt = opt || {};
  if (!opt.url) throw new Error('winston-endpoint: Must set URL');

  winston.Transport.call(this, opt);

  this.name = 'endpoint';
  this.url = opt.url;
  this.json = opt.json || false;
  this.http = opt.http || {};
  this.prependLevel = opt.prependLevel || true;
  this.appendMeta = opt.appendMeta || true;
};

util.inherits(Endpoint, winston.Transport);

Endpoint.prototype.name = 'endpoint';

Endpoint.prototype.log = function log(level, message, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  const headers = Object.assign({},
    this.json ? { 'content-type': 'application/json' } : {},
    this.http.headers);
  const body = this.json
    ? JSON.stringify(Object.assign({ level, message }, meta))
    : (this.prependLevel ? `${level}: ` : '')
      + message
      + (this.appendMeta ? ` ${JSON.stringify(meta)}` : '');

  return got(this.url, Object.assign({ method: 'POST' }, this.http, { headers, body }))
    .then(callback.bind(null, null)).catch(callback);
};

module.exports = Endpoint;
