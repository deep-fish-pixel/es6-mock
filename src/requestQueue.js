const LinkedList = require('friendly-linkedlist');

const linkedList = new LinkedList();
let executing = false;

module.exports = {
  push(callback){
    linkedList.addLast(callback);
  },
  exec(){
    if (executing || linkedList.size() === 0) {
      return;
    }
    executing = true;
    try{
      const callback = linkedList.removeFirst();
      if(callback){
        const promise = callback();
        if (promise) {
          promise.then(() => {
            next();
          });
        } else {
          next();
        }
      }
    } catch (e) {
      console.error(e);
      next();
    }

    const next = () => {
      executing = false;
      // 下一层循环检查
      this.exec();
    }
  },
};
