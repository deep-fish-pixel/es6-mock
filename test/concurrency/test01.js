const fetch = require('node-fetch');

const urls = [
  'http://localhost:8000/api/test/test1',
  'http://localhost:8000/api/test/test2',
  'http://localhost:8000/api/test/test3',
  'http://localhost:8000/api/test/test4',
  'http://localhost:8000/api/test/test5',
  'http://localhost:8000/api/test/test5?offset=0&limit=100',
  'http://localhost:8000/api/test/test6',
  'http://localhost:8000/api/test/test7',
  'http://localhost:8000/api/test/test8',
  'http://localhost:8000/api/test/test8?name=0&id=100',
  'http://localhost:8000/api/test/test9',
  'http://localhost:8000/api/test/test10/xxxx',
  'http://localhost:8000/api/test/test10/list',
  'http://localhost:8000/api/test/test10/status',
];
urls.forEach((url) => {
  fetch(url)
    .then((data) => {
      return data.json()
    }).then((data) => {
      console.log(url, data);
    });
})

