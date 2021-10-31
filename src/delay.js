/**
 * 异步延迟
 * @param time ms
 * @returns {Promise<unknown>}
 */
module.exports = function(time = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
};
