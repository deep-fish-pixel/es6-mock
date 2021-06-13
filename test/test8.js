import { sleep, validate, getRequest } from '../src/index';

// 延迟500ms
sleep(500);

// 校验数据
validate({
  params: {
    name: 'required',
    id: 'required'
  },
  method: 'get'
});

export default {
  'result_code|1-10': '0',
  data: '1000',
  params: getRequest().query
};
