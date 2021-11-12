# es6-mock
使mock数据更简便友好，mock2更强大

* 支持 es6 import/export, import导入库，export输出数据对象
* 支持 request、response、sleep(延迟返回ms)、validate(验证 参数和请求方式)
* 使用 validate 进行params及method校验，params校验规则参考：[node-input-validator](https://www.npmjs.com/package/node-input-validator)
* 支持 [mockjs](http://mockjs.com/examples.html) 数据模板语法
* 提供url动态路径匹配的通配符功能：一个 ```*``` 只匹配mock文件名，2个 ```**``` 匹配mock的多级路径名及文件名
* 支持 热加载（需配置hotServer）

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
        // add express bodyParser
        bodyParserApp: app,
        // 添加热加载
        hotServer: server
      }));
    }
  }
}
```

### Example1：

```javascript
// import 导入工具库
import path from 'path';
import fs from 'fs';
import { sleep, validate, request } from 'es6-mock';

// import 导入其他mock模块
import test1 from './test1';
import test2 from './test2';

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
      // 获取请求参数
      param: request.query,
      // 支持node各种骚操作
      existTest1: fs.existsSync(path.join(__dirname, 'test1.js')),
      existTest0: fs.existsSync(path.join(__dirname, 'no-exist.js'))
    }
};
```


### 通配符使用说明
使用通配符解决url中经常出现包含id等动态参数的路径情况，需要匹配到合适的mock文件并响应内容。

* 在mock文件名称中使用 ```*``` 和 ```**```，可以与字母组合使用，位置不限。
* 一个 ```*``` 表示只匹配文件名称，连续 ```**``` 匹配多级路径名称和一个文件名称。
* 通配符与字母组合使用时，注意通配符位置，分为前匹配(```*test.js```) 中匹配(```*test*.js```) 后匹配(```test*.js```)
* 注意通配符的匹配顺序，无通配符的优先级最高，全通配符的最低，然后是单独1个通配符，最后是2个连续通配符。
  如果一个mock文件夹目录如下，每个文件对应访问路径url路径在小括号中。
  
  按照列表依次匹配，匹配成功则结束匹配，并返回文件内容：
  * 优先匹配文件名称test.js(/api/wildcard/test)
  * 再匹配文件名称test*.js(/api/wildcard/test222)
  * 再匹配文件名称*test.js(/api/wildcard/111test)
  * 再匹配文件名称*.js(/api/wildcard/111test222)
  * 再匹配文件名称```*```test```*```.js(/api/wildcard/111test222)
  * 再匹配文件名称test**.js(/api/wildcard/test111/222)
  * 再匹配文件名称**test.js(/api/wildcard/111/222test)
  * 再匹配文件名称```**```test```**```.js(/api/wildcard/111/222test333/444)
  * 再匹配文件名称**.js(/api/wildcard/111/222/333)
    
  
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
