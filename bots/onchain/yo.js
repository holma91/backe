import Big from 'big.js';

// let x = new Big(9); // '9'
// y = new Big(x); // '9'
// new Big('5032485723458348569331745.33434346346912144534543');
// new Big('4.321e+4'); // '43210'
// new Big('-735.0918e-430'); // '-7.350918e-428'
// Big(435.345); // '435.345'
// new Big(); // 'Error: [big.js] Invalid value'
// Big(); // No error, and a new Big constructor is returned

let x = new Big(0.6553245345345345);
let y = x.times(3.23452342424);

console.log(y.toString());
