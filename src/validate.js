const { Validator } = require('node-input-validator');

const Methods = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
  Patch: 'PATCH'
};

/**
 * 校验请求头
 * @param request
 * @param response
 * @param validates
 */
function validateHeader(request, response, validates) {
  const headers = {
    ...request.headers
  };
  if (validates.header && typeof validates.header.cookie !== 'string') {
    const cookie = {};
    headers.cookie.replace(/(\w+)=([^;]*)/g, (all, key, value) => {
      cookie[key] = value;
    });
    headers.cookie = cookie;
  }
  const validator = new Validator(
    headers,
    validates.header);
  return validator.check().then((matched) => {
    if (!matched) {
      Object.keys(validator.errors).map(key => validator.errors[key].message = (validator.errors[key].message || '').replace(/^The /, 'header.'));
      response.status(422).send(validator.errors);
      return false;
    }
    return true;
  });
}

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
      Object.keys(validator.errors).map(key => validator.errors[key].message = (validator.errors[key].message || '').replace(/^The /, 'param.'));
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

/**
 * 验证请求的header param method
 * @param request
 * @param response
 * @param validates
 * @returns {Promise<boolean>}
 */
function validate(request, response, validates) {
  if(validateMethod(request, response, validates.method)){
    return validateHeader(request, response, validates)
      .then(((resulte) => {
        if (resulte){
          return validateParam(request, response, validates);
        }
        return false;
      }))
  }
  return Promise.resolve(true);
}

/**
 * 支持二级子属性的校验
 * @param values
 * @param lowerCase
 * @returns {{}}
 */
function transformSubProperties(values, lowerCase){
  const results = {};
  Object.keys(values).forEach(key => {
    const lowerKey = lowerCase ? key.toLowerCase() : key;
    const subValues = values[key];
    if (typeof subValues !== 'string') {
      Object.keys(subValues).forEach(subKey => {
        results[`${key}.${subKey}`] = subValues[subKey];
      });
    } else {
      results[lowerKey] = values[key];
    }
  });
  return results;
}

validate.init = function (request, response) {
  request.validate = {
    value: {
      header: {},
      param: {},
      method: ''
    },
    add(validates) {
      if (validates.header) {
        Object.assign(this.value.header, transformSubProperties(validates.header, true));
      }
      if (validates.param) {
        Object.assign(this.value.param, transformSubProperties(validates.param));
      }
      if (validates.method) {
        this.value.method = validates.method;
      }
    },
    exec(){
      return validate(request, response, this.value);
    }
  }
}

module.exports = validate;
