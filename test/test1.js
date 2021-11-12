import { sleep, validate, request } from '../src/index';

// 延迟500ms
sleep(500);

// 校验数据
validate({
  // 参数校验
  param: {
    name: 'required',
    id: 'required'
  },
  // 请求方法校验
  method: 'get'
});

export default {
  data: 'test1.js',
  param: request.query
};
