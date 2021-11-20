import { delay, validate } from '../../src/index';

delay(1300);

validate({
  param: {},
  method: 'get'
});

export default {
  code: '0001',
  data: 'wildcard/**.js'
};
