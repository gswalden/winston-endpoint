'use strict';

const nock = require('nock');
const assert = require('assert');
const Endpoint = require('../');
const winston = require('winston');

describe('winston-endpoint tests', () => {
  let scope, logger, body, url;

  beforeEach(() => {
    url = 'http://localhost:5555';
    body = null;
    scope = nock(url).post('/').reply(200, (uri, reqBody) => {
      return body = reqBody;
    });
    logger = new winston.Logger({
      transports: [
        new winston.transports.Endpoint({ url })
      ]
    })
  });

  it('logs a string to specified endpoint', done => {
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(scope.isDone());
      assert.equal(body, `info: ${log} {}`);
      done(err);
    });
  });

  it('logs a json object to specified endpoint', done => {
    logger.transports.endpoint.json = true;
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(scope.isDone());
      assert.equal(body.message, log);
      done(err);
    });
  });

  it('prependLevel = false works', done => {
    logger.transports.endpoint.prependLevel = false;
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(scope.isDone());
      assert.equal(body, `${log} {}`);
      done(err);
    });
  });

  it('appendMeta = false works', done => {
    logger.transports.endpoint.appendMeta = false;
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(scope.isDone());
      assert.equal(body, `info: ${log}`);
      done(err);
    });
  });

  it('silent = true works', done => {
    logger.transports.endpoint.silent = true;
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(!scope.isDone());
      done(err);
    });
  });

  it('does not log levels below minimum', done => {
    logger.transports.endpoint.level = 'error';
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(!scope.isDone());
      done(err);
    });
  });

  it('can change http method', done => {
    logger.transports.endpoint.http = { method: 'PUT' };
    let putScope = nock(url).put('/').reply(200, (uri, reqBody) => {
      return body = reqBody;
    });
    const log = 'So say we all.';
    logger.info(log, err => {
      assert(putScope.isDone());
      done(err);
    });
  });

  afterEach(() => {
    nock.removeInterceptor(scope);
  });
})
