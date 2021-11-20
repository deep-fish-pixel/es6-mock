import { delay, validate } from '../../src/index';

delay(800);

validate({
  param: {},
  method: 'get'
});

export default {
  code: '0001',
  data: 'wildcard/*test*.js'
};
