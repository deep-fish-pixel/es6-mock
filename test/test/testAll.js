const fetch = require('node-fetch');

const urls = [
  'http://localhost:8000/api/test/test1?name=xx&&id=ss',
  'http://localhost:8000/api/test/test2',
  'http://localhost:8000/api/test/test3?name=xx&&id=ss',
  'http://localhost:8000/api/test/test-wildcard/test',
  'http://localhost:8000/api/test/test-wildcard/111test',
  'http://localhost:8000/api/test/test-wildcard/test222',
  'http://localhost:8000/api/test/test-wildcard/111',
  'http://localhost:8000/api/test/test-wildcard/sss/111test',
  'http://localhost:8000/api/test/test-wildcard/test222/xxx/zzz',
  'http://localhost:8000/api/test/test-wildcard/sss/111/sss-test-aaa/222/xxx',
  'http://localhost:8000/api/test/test-wildcard/sss/test/xxxx',
  'http://localhost:8000/api/test/test-wildcard/111/222/333/444'
];
urls.forEach((url) => {
  fetch(url)
    .then((data) => {
      return data.json()
    }).then((data) => {
      console.log(url, data);
    });
})

