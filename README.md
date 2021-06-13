# es6-mock
使mock数据更简便友好，mock2更强大

* 支持 es6 import/export mock 数据
* 支持 import/export 使用开源库
* 内置 web服务 express对象 $request、$response
* 内置 $sleep 延迟输出
* 内置 $validate 进行params及method校验，params校验库：[node-input-validator](https://www.npmjs.com/package/node-input-validator)
* 支持 mockjs 输出mock格式的数据

### Install
Install with npm:

`$ npm install --save-dev es6-mock`

### Uses

在webpack.config.js或vue.config.js的devServer中配置

```angular2html
const es6Mock = require('es6-mock');

devServer: {
    before: function (app) {
        app.use(es6Mock({
            // 模拟数据js存放根目录
            dir: './mock',
            // url访问根路径名称 
            path: '/api',
            // add express bodyParser
            bodyParserApp: app
        }));
    }
}
```
### Examples：

```angular2html
// 使用sleep延期1000ms响应 test1.js
// url地址：http://localhost:port/api/test1

sleep(1000);

export default {
    code: 1000,
    data: 'test1'
};

```

```angular2html
// 支持mockjs  test2.js
// url地址：http://localhost:port/api/test2

export default {
    code: 1000,
    data: {
        'star|1-10': '★',
        "switch|1-2": true
    }
};
```

```angular2html
// 支持 import 导入模块 test3.js
// url地址：http://localhost:port/api/test3

import test1 from './test1';
import test2 from './test2';

export default {
    code: 1000,
    data: 'test03',
    test1,
    test2
};
```

```angular2html
// 使用request获取参数  test4.js
// url地址：http://localhost:port/api/test4

export default {
    code: 1000,
    data: request.query.color
};
```

```angular2html
// 使用validate校验method及参数 test5.js
// url地址：http://localhost:port/api/test5

$validate({
    // 对参数校验
    params: {
        id: 'required',
        name: 'required'
    },
    // 对请求方式校验
    method: 'get|post|put|delete|patch'
});

export default {
    code: 1000,
    data: 'test6'
};
```

```angular2html
// 引用path、fs库 test6.js
// url地址：http://localhost:port/api/test6

import path from 'path';
import fs from 'fs';

export default {
    code: 1000,
    data: 'test5',
    exist: fs.existsSync(path.join(__dirname, 'test6.js'))
};
```

```angular2html
// 使用其他开源库  test7.js
// url地址：http://localhost:port/api/test7

import deasync from 'deasync';

//等待2s
deasync.sleep(2000);

export default {
    code: 2000,
    data: 'test7'
};
```
