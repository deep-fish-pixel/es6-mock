const { Validator } = require('node-input-validator');

const Methods = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
  Patch: 'PATCH'
};


module.exports = function (validates) {
  __request.validated = true;
  if(!validateMethod(validates.method)){
    return validateParams(__request.method === Methods.Get ? __request.query : __request.body, validates.params);
  }
}

/**
 * 校验参数
 * @param body
 * @param params
 */
function validateParams(body, params) {
  const validator = new Validator(body, params);
  return validator.check().then((matched) => {
    __request.validateFailed = true;
    __response.status(422).send(validator.errors);
    return true;
  });
}

/**
 * 验证请求method 'get|post|put|delete|patch'
 * @param method
 * @returns {boolean}
 */
function validateMethod(method){
  if (method) {
    const requestMethod = __request.method;
    const methods = method.split('|').map(item => item.toUpperCase());
    if(!methods.some(method => method === requestMethod)){
      __request.validateFailed = true;
      __response.status(422).send({
        method: `The request method is ${requestMethod}, doesn't support ${method.toUpperCase()}`
      });
      return true;
    }
  }
  return false;
}
