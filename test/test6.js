// 使用path、fs test6.js
import path from 'path';
import fs from 'fs';

export default {
  code: 1000,
  data: 'test6',
  exist: fs.existsSync(path.join(__dirname, 'test6.js'))
};
