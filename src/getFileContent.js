const fs = require('fs');
const path = require('path');

const tails = ['.js', '.json'];

/**
 * 获取存在的文件路径
 * @param moduleName
 * @param dir
 * @param originFilename
 * @param delayCheckSelf
 * @returns {{filename, content: string}|*}
 */
function getFilePath(moduleName, dir, originFilename, delayCheckSelf) {
  let filePath = '';
  let isExist = false;
  if (moduleName.match(/\.\w+$/)) {
    isExist = fs.existsSync(moduleName);
    filePath = moduleName;
  }

  if (!isExist && !delayCheckSelf) {
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
      // 排序文件列表 匹配符*置后
      const files = fs.readdirSync(moduleName).sort().reverse();
      const hasTail = originFilename.match(/\.\w+$/);

      for (const file of files){
        let tailMatch = file.match(/(\.\w+)$/);
        let fullName = hasTail ? originFilename : `${originFilename}${tailMatch? tailMatch[0] : ''}`
        if (file.match(/\.\w+$/)
          && fullName.match(
            new RegExp(`[\/]${
              file
              .replace(/\./g, '\\.')
              .replace(/\*/g, '.*')
            }$`)
          )
        ) {
          isExist = true;
          filePath = path.join(moduleName, file);
          break;
        }
      }
    }
  }

  if (!isExist && delayCheckSelf) {
    isExist = tails.some(tail => {
      const filename = `${moduleName}${tail}`;
      if (fs.existsSync(filename)) {
        filePath = filename;
        return true;
      }
      return false;
    });
  }

  if (!isExist && moduleName.indexOf(dir) === 0) {
    const parentPath = moduleName.replace(/\/[^\/]+\/?$/, '');
    // 更新当前父目录 用于require路径
    global.__parentPath = parentPath;
    return getFilePath(parentPath, dir, originFilename || moduleName, true);
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
