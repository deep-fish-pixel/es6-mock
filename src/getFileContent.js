const fs = require('fs');
const path = require('path');

const tails = ['.js'];

/**
 * 获取存在的文件路径
 * @param moduleName
 * @param dir
 * @param originFilename
 * @param delayCheckSelf
 * @returns {{filename, content: string}|*}
 */
function getFilePath(moduleName, dir, originFilename, delayCheckSelf, isDeep) {
  let filePath = '';
  let isExist = false;
  if (moduleName.match(/\.\w+$/)) {
    isExist = fs.existsSync(moduleName);
    filePath = moduleName;
  }

  if (!isExist && !delayCheckSelf && !isDeep) {
    filePath = getDefautFile(moduleName);
    isExist = !!filePath;
  }

  if (!isExist) {
    if(fs.existsSync(moduleName) && originFilename){
      // 排序文件列表 匹配符*置后
      const files = sortFiles(fs.readdirSync(moduleName));
      const hasTail = originFilename.match(/\.\w+$/);
      const relativeFilePath = originFilename.replace(moduleName, '');

      for (const file of files){
        const tailMatch = file.match(/(\.\w+)$/);
        const fullName = hasTail ? relativeFilePath : `${relativeFilePath}${tailMatch? tailMatch[0] : ''}`
        if (file.match(/\.\w+$/)
          && fullName.match(
            new RegExp(`^[\/]${
              file
              .replace(/\.(\w+)$/g, '\\.$1')
              .replace(/\*\*([\w-.])/g, '([\\w-.]#\\/)#*$1')
              .replace(/([\w-.])\*\*/g, '$1*([\\w-.]#\\/)#*')
              .replace(/\*\*/g, '.#*')
              .replace(/\*/g, '[\\w-.]*')
              .replace(/#/g, '*')
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

  if (!isExist && delayCheckSelf && !isDeep) {
    filePath = getDefautFile(moduleName);
    isExist = !!filePath;
  }

  if (!isExist && moduleName.indexOf(dir) === 0) {
    const parentPath = moduleName.replace(/\/[^\/]+\/?$/, '');
    // 更新当前父目录 用于require路径
    global.__parentPath = parentPath;
    return getFilePath(parentPath, dir, originFilename || moduleName, true, true);
  }

  return {
    isExist,
    filename: filePath
  };

}

/**
 * 获取文件，支持moduleName默认index查找
 * @param moduleName
 */
function getDefautFile(moduleName){
  let filePath;
  tails.some(tail => {
    const filename = `${moduleName}${tail}`;
    const defaultFilename = `${moduleName}/index${tail}`;
    if (fs.existsSync(filename)) {
      filePath = filename;
      // 判断为文件，需要更新当前父目录
      global.__parentPath = moduleName.replace(/\/[^\/]+\/?$/, '');
      return true;
    } else if(fs.existsSync(defaultFilename)){
      filePath = defaultFilename;
      global.__parentPath = moduleName;
      return true;
    }
    return false;
  });
  return filePath;
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

  throw Error(`The file not exists: ${moduleName} `);
}

/**
 * 排序文件列表 通配符*置后
 * @param list
 */
function sortFiles(list){
  const normalFiles = [],
    wildcardFiles = [],
    wildcardDoubleFiles = [],
    wildcardMatch = /\*/,
    wildcardDoubleMatch = /\*\*/;
  list.forEach(file => {
    if (file.match(wildcardDoubleMatch)) {
      return wildcardDoubleFiles.push(file);
    }
    if (file.match(wildcardMatch)) {
      return wildcardFiles.push(file);
    }
    normalFiles.push(file);
  });
  return normalFiles.sort().reverse()
    .concat(wildcardFiles.sort().reverse())
    .concat(wildcardDoubleFiles.sort().reverse())
}


module.exports = getFileContent;
