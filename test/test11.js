const sleep = require('atomic-sleep')

console.time('sleep')
setTimeout(() => { console.timeEnd('sleep') }, 100)
console.log('start...');
sleep(10000);
console.log('end');
