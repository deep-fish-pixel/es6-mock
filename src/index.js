const path = require('path');
const Mock = require('mockjs');
const bodyParser = require('body-parser');
const miniRequire = require('./mini-require');
const sleep = require('./sleep');
const handleResponse = require('./handleResponse');
const delay = require('./delay');
const validate = require('./validate');
const hotReload = require('./hotReload');

/**
 * 中间件mock
 * @param dir
 * @param urlPath
 * @param bodyParserApp app应用
 * @param app app应用
 * @param hotServer 热加载服务器
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function ({ dir, path: urlPath, bodyParserApp, app, hotServer }) {
  app = app || bodyParserApp;
  if (app) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
  }
  if (dir) {
    hotReload(hotServer, dir);
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
        Object.assign(module.exports, {
          request: global.__request,
          response: global.__response,
        });
        delay.init(request, response);
        validate.init(request, response);
        const content = miniRequire(file, path.join(process.cwd(), dir));
        // 验证和延迟为异步
        return handleResponse(request, response).then((result) => {
          if (result) {
            response.json(Mock.mock(content || {}));
          }
        }).catch(() => {});
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
  delay: (time) => {
    global.__request.delay.add(time);
  },
  validate: (validates) => {
    global.__request.validate.add(validates);
  },
  request: global.__request,
  response: global.__response,
  getRequest: function (){
    return global.__request;
  },
  getResponse: function (){
    return global.__response;
  },
});

