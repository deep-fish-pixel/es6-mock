module.exports = function (request) {
  return request.validate.exec()
    .then((result) => {
      if (result) {
        return request.delay.exec();
      }
      return false;
    })
}
