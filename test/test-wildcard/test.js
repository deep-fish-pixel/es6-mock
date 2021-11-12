import { sleep, validate } from '../../src/index';

sleep(500);

validate({
  param: {},
  method: 'get'
});

export default {
  code: '0001',
  data: 'test-wildcard/test.js'
};
