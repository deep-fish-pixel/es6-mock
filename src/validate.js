const { Validator } = require('node-input-validator');

const Methods = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
  Patch: 'PATCH'
};


/**
 * 校验参数
 * @param request
 * @param response
 * @param validates
 */
function validateParam(request, response, validates) {
  const validator = new Validator(
    request.method === Methods.Get
    ? request.query
    : request.body,
    validates.param || validates.params);
  return validator.check().then((matched) => {
    if (!matched) {
      response.status(422).send(validator.errors);
      return false;
    }
    return true;
  });
}

/**
 * 验证请求method 'get|post|put|delete|patch'
 * @param request
 * @param response
 * @param method
 * @returns {boolean}
 */
function validateMethod(request, response, method){
  if (method) {
    const requestMethod = request.method;
    const methods = method.split('|').map(item => item.toUpperCase());
    if(!methods.some(method => method === requestMethod)){
      response.status(422).send({
        method: `The request method is ${requestMethod}, doesn't support ${method.toUpperCase()}`
      });
      return false;
    }
  }
  return true;
}

function validate(request, response, validates) {
  if(validateMethod(request, response, validates.method)){
    return validateParam(request, response, validates);
  }
  return Promise.resolve(true);
}

module.exports = validate;

module.exports.init = function (request, response) {
  request.validate = {
    value: {
      param: {},
      method: ''
    },
    add(validates) {
      Object.assign(this.value.param, validates.param);
      this.value.method = validates.method;
    },
    exec(){
      return validate(request, response, this.value);
    }
  }
}
