const fs = require('fs');
const path = require('path');

const tails = ['.js', '.ts', '.jsx', '.vue'];

/**
 * 获取存在的文件路径
 * @param moduleName
 * @returns {{filename, content: string}|*}
 */
function getFilePath(moduleName, dir, originFilename) {
  let filePath = '';
  let isExist = false;
  if (moduleName.match(/\.\w+$/)) {
    isExist = fs.existsSync(moduleName);
    filePath = moduleName;
  }

  if (!isExist) {
    isExist = tails.some(tail => {
      const filename = `${moduleName}${tail}`;
      if (fs.existsSync(filename)) {
        filePath = filename;
        return true;
      }
      return false;
    });
  }

  if (!isExist) {
    if(fs.existsSync(moduleName) && originFilename){
      const files = fs.readdirSync(moduleName);
      if (!originFilename.match(/\.\w+$/)) {
        originFilename += '.js';
      }
      for (const file of files){
        if (file.match(/\.\w+$/) && originFilename.match(new RegExp(file.replace(/\*/g, '.*')))) {
          isExist = true;
          filePath = path.join(moduleName, file);
          break;
        }
      }
    }
  }

  if (!isExist && moduleName.indexOf(dir) === 0) {
    const parentPath = moduleName.replace(/\/[^\/]+\/?$/, '');
    // 更新当前父目录 用于require路径
    global.__parentPath = parentPath;
    return getFilePath(parentPath, dir, originFilename || moduleName);
  }

  return {
    isExist,
    filename: filePath
  };

}


/**
 * 获取模块内容
 * @param moduleName
 * @returns {{filename, content: string}|*}
 */
function getFileContent(moduleName, dir) {
  const { isExist, filename } = getFilePath(moduleName, dir);
  if (isExist) {
    return {
      content: fs.readFileSync(filename, 'utf8'),
      filename
    }
  }

  throw Error(`the file not exists: ${moduleName}`);
}


module.exports = getFileContent;
