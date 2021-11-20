// import 导入工具库
import path from 'path';
import fs from 'fs';
import { delay, validate, request } from '../src';

// import 导入其他mock模块
import test1 from './test1';
import test2 from './test2';

// 延迟500ms
delay(400);

// 校验数据
validate({
  // 参数校验类型、格式等及是否必选
  param: {
    name: 'required|string',
    id: 'required|integer'
  },
  // 请求方法校验
  method: 'get|post'
});

// 导出mock数据
export default {
  // 使用mockjs数据模板
  'code|1-10': '0',
  data: {
    "switch|1-2": true,
    name: 'test03.js',
    // 组装其他mock数据，数据量大的时候非常有用
    test1,
    test2,
    // 获取请求get参数
    param: request.query,
    // 获取请求post参数
    param2: request.body,
    // 支持node各种骚操作
    existTest1: fs.existsSync(path.join(__dirname, 'test1.js')),
    existTest0: fs.existsSync(path.join(__dirname, 'no-exist.js'))
  }
};
