const path = require('path');
const Mock = require('mockjs');
const bodyParser = require('body-parser');
const requestQueue = require('./requestQueue');
const miniRequire = require('./mini-require');
const sleep = require('./sleep');
const delay = require('./delay');
const validate = require('./validate');
const hotReload = require('./hotReload');

/**
 * 中间件mock
 * @param dir
 * @param urlPath
 * @param bodyParserApp app应用
 * @param hotServer 热加载服务器
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function ({ dir, path: urlPath, bodyParserApp, hotServer }) {
  if (bodyParserApp) {
    bodyParserApp.use(bodyParser.urlencoded({extended: false}));
    bodyParserApp.use(bodyParser.json());
  }
  if (dir) {
    hotReload(hotServer, dir);
  }
  return function (request, response, next) {
    if (request.path.indexOf(urlPath) === 0) {
      // 收集请求
      requestQueue.push(() => {
        const file = path.join('/', dir, `${
          request.path.replace(urlPath, '')
            .replace(/\.\w+/, '')
            .replace(/\/$/, '')}`);

        try {
          global.__request = request;
          global.__response = response;
          const content = miniRequire(file, path.join(process.cwd(), dir));
          // 验证为异步，需要一个等待
          return delay(0).then(() => {
            // 验证通过时返回值
            if (!request.validateFailed) {
              response.json(Mock.mock(content || {}));
            }
          });
        } catch (e) {
          response.status(404).send(e.message);
        }
      });
      // 处理请求
      requestQueue.exec();
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

