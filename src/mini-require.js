const fs = require('fs');
const path = require('path');
const sleep = require('./sleep');

const tails = ['.js', '.ts', '.jsx', '.vue'];

/**
 * 微型模块加载器
 * @param moduleName
 * @returns {*}
 */
function miniRequire(moduleName) {
  if (moduleName && moduleName.match(/^[\w]/)) {
    return require(moduleName);
  }
  const prevParentPath = global.__parentPath;
  const request = global.__request;
  const response = global.__request;
  const filePath = getFilePath(moduleName, prevParentPath);

  global.__parentPath = filePath.replace(/\/[^/]+$/, '');

  const { content, filename } = getContent(filePath) || {};
  const params = [
    'exports', 'module', 'require',
    '__dirname', '__filename',
    'request', 'response',
    'sleep'
  ];
  const exportConsts = [];
  const data = content
    .replace(/import\s+([./\w-$]+|\{[\s,./\w-$]+})\s+from (['"][./\w-$]+['"])/g, 'const $1 = require($2)')
    .replace(/export\s+default([^\w-$])/g, 'module.exports =$1')
    .replace(/export\s+(const|function)\s+([\w$]+)/g, (all, $1, name) => {
      exportConsts.push(`exports.${name} = ${name}`);
      return `${$1} ${name}`;
    });

  const fn = new Function(...params, `${data}\n ${exportConsts.join('\n')} \n return module.exports`);

  const module = {
    exports: {}
  };

  const result = fn(
    module.exports, module, miniRequire,
    filename.replace(/\/[^/]+$/, ''), filename,
    request, response,
    sleep
  );

  // 恢复上一次操作
  global.__parentPath = prevParentPath;
  return result;
}

/**
 * 获取模块内容
 * @param moduleName
 * @returns {{filename, content: string}|*}
 */
function getContent(moduleName) {
  if (moduleName.match(/\.\w+$/)) {
    return {
      content: fs.readFileSync(moduleName, 'utf8'),
      filename: moduleName
    };
  }
  let result;

  tails.some(tail => {
    const filename = `${moduleName}${tail}`;

    if (fs.existsSync(filename)) {
      result = {
        content: fs.readFileSync(filename, 'utf8'),
        filename: filename,
      };
      return true;
    }
    return false;
  });

  if (result) {
    return result;
  }
  throw Error(`the file not exists: ${moduleName}`);
}

/**
 * 获取模块全路径
 * @param moduleName
 * @param prevParentPath
 * @returns {string}
 */
function getFilePath(moduleName, prevParentPath) {
  if (moduleName.match(/^\./)) {
    return path.join(prevParentPath, moduleName);
  }
  return path.join(process.cwd(), moduleName);
}

module.exports = miniRequire;
