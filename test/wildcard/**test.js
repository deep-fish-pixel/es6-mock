import { delay, validate } from '../../src/index';

delay(1100);

validate({
  param: {},
  method: 'get'
});

export default {
  code: '0001',
  data: 'wildcard/**test.js'
};
