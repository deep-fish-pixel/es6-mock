// 使用validate校验method及参数 test5.js
// 参数校验使用库：node-input-validator
$validate({
  param: {
    offset: 'required|integer',
    limit: 'required|integer'
  },
  method: 'get'
});

export default {
  code: 1000,
  data: 'test5'
};
