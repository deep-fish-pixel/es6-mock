# es6-mock
使mock代码更强大友好

* 支持 es6 import/export mock 数据
* 内置 sleep 延迟输出
* 内置 web服务 express对象 request、response
* 内置基本工具对象 fs、path
* 使用 mockjs mock你的数据

### Install
Install with npm:

`$ npm install --save-dev es6-mock`

### Uses：

```angular2html
// 使用devServer启用es6Mock

const es6Mock = require('es6-mock');

devServer: {
    before: function (app) {
        app.use(es6Mock({
            dir: './mock',
            path: '/api'
        }));
    }
}
```

```angular2html
// 使用sleep延期1000ms响应 test1.js

sleep(1000);

export default {
    code: 1000,
    data: 'test1'
};
```

```angular2html
// 支持mockjs  test2.js

export default {
    code: 1000,
    data: {
        'star|1-10': '★',
        "switch|1-2": true
    }
};
```

```angular2html
// 支持 import 导入模块 ./test3

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
// 使用request获取参数

export default {
    code: 1000,
    data: request.query.color
};
```
