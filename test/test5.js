// 使用validate校验method及参数 test5.js
// 参数校验使用库：node-input-validator
$validate({
  params: {
    id: 'required',
    name: 'required'
  },
  method: 'get|post|put'
});

export default {
  code: 1000,
  data: 'test6'
};
