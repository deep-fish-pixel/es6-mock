module.exports = function(time) {
  if(global.__request){
    global.__request.add(time);
  }
};

module.exports.init = function (request) {
  request.delay = {
    value: 0,
    add(time) {
      this.value += time;
    },
    exec(){
      if(this.value){
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, this.value);
        })
      }
      return Promise.resolve(true);
    }
  }
}
