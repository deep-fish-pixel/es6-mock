import { delay, validate, request } from '../src/index';

// 延迟ms
delay(200);

// 校验数据
validate({
  // 请求头验证
  header: {
    'Accept-Encoding': 'required',
    cookie: {
      _gid: 'required'
    },
  },
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
