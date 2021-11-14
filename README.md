# es6-mock [中文](./README-CN.md)
This tool makes mock data friendly and powerful.

* Supports es6 import/export. import module lib, export json data.
* Supports request、response、sleep(delay response time)、validate(validate request params and method)
* Use Validate validates request params type and method

  Params rule references：[node-input-validator](https://www.npmjs.com/package/node-input-validator)
  
  Method can check one or some of this list: ```get|post|put|delete|patch```
  
* Supports [mockjs](http://mockjs.com/examples.html) data template rule
* Supply dynamic url path wildcard match：one ```*``` only match mock filename，double and serial ```**``` will match multi pathes and filename
* Supports HMR（Config hotServer）

### Install
Install with npm:

`$ npm install --save-dev es6-mock`

### Uses

Config webpack.config.js or vue.config.js devServer property

```javascript
const es6Mock = require('es6-mock');

module.exports =  {
  devServer: {
    before: function (app, server) {
      app.use(es6Mock({
        // Set mock file`s root
        dir: './mock',
        // Url root path 
        path: '/api',
        // Add express bodyParser
        bodyParserApp: app,
        // Set Hot Reload
        hotServer: server
      }));
    }
  }
}
```

### Mock Data Example

```javascript
// Import lib
import path from 'path';
import fs from 'fs';
import { sleep, validate, request } from 'es6-mock';

// Import other mock datas
import test1 from './test1';
import test2 from './test2';

// Delay response 500ms
sleep(500);

// Validate request （If validate failed, will return validate messages as response）
validate({
    // Validate param required、 type or format
    param: {
        name: 'required|string',
        id: 'required|integer'
    },
    // Validate request method
    method: 'get|post'
});

// Export mock data，if validate pass
export default {
    // Use mockjs data template
    'code|1-10': '0',
    data: {
      "switch|1-2": true,
      name: 'test03.js',
      // Use other mock data. This will very useful in large data content
      test1,
      test2,
      // Get request get param
      param: request.query,
      // Get request post param
      param2: request.body,
      // Support node various operations
      existTest1: fs.existsSync(path.join(__dirname, 'test1.js')),
      existTest0: fs.existsSync(path.join(__dirname, 'no-exist.js'))
    }
};
```


### Instructions for using filename wildcards

Use wildcard resolve url often occur paths containing dynamic params such as ID、RESTful API, 
It is necessary to match the appropriate mock file and respond to the content.

* Mock filename use ```*``` and ```**```, these can be used in combination with letters.
* One ```*``` indicates that only match file name, Serie double ```**``` match multi-level pathes and a file name.
* When wildcards are combined with letters, pay attention to the position of wildcards, which are divided into tail matching(```test*.js```) front matching(```*test.js```)  front&tail matching(```*test*.js```)  whole matching(```*.js```)
* Note the matching order of file name wildcards. The file name without wildcards has the highest priority, then a single wildcard(The order of internal wildcard positions is: tail、front、front&tail、whole matching), and then two consecutive wildcards(The order of internal wildcard positions is: tail、front、front&tail、whole matching).

  If a mock folder directory has the following file list:
  
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

  Match in sequence according to the list. If the matching is successful, the matching ends, and the request response returns the contents of the file:
  * Priority match file name: test.js (url: /api/wildcard/test)
  * Then match the file name: test*.js (url: /api/wildcard/test222)
  * Then match the file name: *test.js (url: /api/wildcard/111test)
  * Then match the file name: ```*```test```*```.js (url: /api/wildcard/111test222)
  * Then match the file name: *.js (url: /api/wildcard/111222)
  * Then match the file name: test**.js (url: /api/wildcard/test111/222)
  * Then match the file name: **test.js (url: /api/wildcard/111/222test)
  * Then match the file name: ```**```test```**```.js (url: /api/wildcard/111/222test333/444)
  * Last match the file name: **.js (url: /api/wildcard/111/222/333)

  _Tip：The URL in parentheses in each line can successfully obtain the content of the current mock file as a response_
