import { delay, validate } from '../../src/index';

delay(900);

validate({
  param: {},
  method: 'get'
});

export default {
  code: '0001',
  data: 'wildcard/*.js'
};
