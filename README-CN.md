# es6-mock
mock数据更友好和强大

* 支持 es6 import/export, import导入库，export输出数据对象
* 支持 request、response、delay(延迟响应ms)、validate(验证 参数和请求方式)
* 使用 validate 进行params及method校验
  
    params校验规则参考：[node-input-validator](https://www.npmjs.com/package/node-input-validator)

    method校验方式支持 ```get|post|put|delete|patch```
  
* 支持 [mockjs](http://mockjs.com/examples.html) 数据模板语法
* 提供url动态路径匹配的通配符功能：一个 ```*``` 只匹配mock文件名，2个 ```**``` 匹配mock的多级路径名及文件名
* 支持 热加载（配置hotServer）

### Install
Install with npm:

`$ npm install --save-dev es6-mock`

### Uses

在webpack.config.js或vue.config.js的devServer中配置

```javascript
const es6Mock = require('es6-mock');

module.exports =  {
  devServer: {
    before: function (app, server) {
      app.use(es6Mock({
        // 模拟数据js存放根目录
        dir: './mock',
        // url访问根路径名称 
        path: '/api',
        // add express json bodyParser
        app: app,
        // 添加热加载
        hotServer: server
      }));
    }
  }
}
```

### Mock Data Example

```javascript
// import 导入工具库
import path from 'path';
import fs from 'fs';
import { delay, validate, request } from 'es6-mock';

// import 导入其他mock模块
import test1 from './test1';
import test2 from './test2';

// 延迟500ms
delay(500);

// 校验数据（如果校验不通过，则返回详细的校验错误作为请求响应）
validate({
    // 请求头验证
    header: {
      'Cache-Control': 'required|equals:no-cache',
      cookie: {
        _gid: 'required'
      },
    },
    // 参数校验类型、格式等及是否必选
    param: {
      name: 'required|string',
      id: 'required|integer'
    },
    // 请求方法校验
    method: 'get'
});

// 校验通过后，则以导出mock数据作为请求响应
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
```


### 文件名通配符使用说明
使用通配符解决url中经常出现路径中包含一个（如经常出现的id或使用RESTful API）或多个动态参数的情况，此时需要匹配到合适的mock文件并响应内容。

* 在mock文件名称中使用 ```*``` 和 ```**```，可以与字母组合使用。
* 一个 ```*``` 表示只匹配文件名称，连续 ```**``` 匹配多级路径名称和一个文件名称。
* 通配符与字母组合使用时，注意通配符位置，分为前匹配(```test*.js```) 后匹配(```*test.js```) 居中匹配(```*test*.js```) 全匹配(```*.js```)
* 注意文件名通配符的匹配顺序，无通配符的优先级最高，1个通配符次之（内部根据通配符位置的顺序： 前匹配 后匹配 居中匹配 全匹配），然后是2个连续通配符（内部根据通配符位置的顺序：后匹配 前匹配 前后匹配 全匹配）。
  
  如果一个mock文件夹目录存在如下的文件列表：
  
    ```html
    mock dir:
        wildcard
            test.js
            test*.js
            *test.js
            *test*.js
            *.js
            test**.js
            **test.js
            **test**.js
            **.js
    ```
  
  按照列表依次匹配，匹配成功则结束匹配，并以该文件内容作为请求响应：
  * 优先匹配文件名: test.js (url: /api/wildcard/test)
  * 然后匹配文件名: test*.js (url: /api/wildcard/test222)
  * 然后匹配文件名: *test.js (url: /api/wildcard/111test)
  * 然后匹配文件名: ```*```test```*```.js (url: /api/wildcard/111test222)
  * 然后匹配文件名: *.js (url: /api/wildcard/111222)
  * 然后匹配文件名: test**.js (url: /api/wildcard/test111/222)
  * 然后匹配文件名: **test.js (url: /api/wildcard/111/222test)
  * 然后匹配文件名: ```**```test```**```.js (url: /api/wildcard/111/222test333/444)
  * 最后匹配文件名: **.js (url: /api/wildcard/111/222/333)

  _提示：每行小括号中url可以成功获取到为当前的mock文件的内容做为响应_
