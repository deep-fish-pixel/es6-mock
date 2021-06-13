const path = require('path');
const Mock = require('mockjs');
const bodyParser = require('body-parser');
const miniRequire = require('./mini-require');
const sleep = require('./sleep');
const validate = require('./validate');

/**
 * 中间件mock
 * @param dir
 * @param urlPath
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function ({ dir, path: urlPath, bodyParserApp }) {
  if (bodyParserApp) {
    bodyParserApp.use(bodyParser.urlencoded({extended: false}));
    bodyParserApp.use(bodyParser.json());
  }
  return function (request, response, next) {
    if (request.path.indexOf(urlPath) === 0) {
      const file = path.join('/', dir, `${
        request.path.replace(urlPath, '')
          .replace(/\.\w+/, '')
          .replace(/\/$/, '')}`);

      try {
        global.__request = request;
        global.__response = response;
        const content = miniRequire(file);
        if (request.validated) {
          sleep(0);
        }
        // 验证通过时返回值
        if (!request.validateFailed) {
          response.json(Mock.mock(content || {}));
        }
      } catch (e) {
        response.status(404).send(e.message);
      }
    } else {
      next();
    }
  };
};

Object.assign(module.exports, {
  sleep,
  validate,
  getRequest: function (){
    return global.__request;
  },
  getResponse: function (){
    return global.__response;
  },
});

