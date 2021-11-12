import { sleep, validate, request } from '../src/index';

// 延迟500ms
sleep(500);

// 校验数据
validate({
  param: {
    name: 'required',
    id: 'required'
  },
  method: 'get'
});

export default {
  'result_code|1-10': '0',
  data: 'test2.js',
  param: request.query
};
