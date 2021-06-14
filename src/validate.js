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
    return validateParam(__request.method === Methods.Get ? __request.query : __request.body, validates.param || validates.params);
  }
  return Promise.resolve(false);
}

/**
 * 校验参数
 * @param body
 * @param param
 */
function validateParam(body, param) {
  const validator = new Validator(body, param);
  return validator.check().then((matched) => {
    if (!matched) {
      __request.validateFailed = true;
      __response.status(422).send(validator.errors);
    }
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
