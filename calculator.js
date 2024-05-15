const Calculator_One = require('./modules/calculator_module_1');

const calculator_one = new Calculator_One();
console.log(calculator_one.add(2,5));

// Another Method
const calculator_two = require('./modules/calculator_module_2');
console.log(calculator_two.add(2,6));


// Calling By Decouling the Function 
// We can define all functions or Just the ones we need in this case I only needed add function
const { add  } = require('./modules/calculator_module_2');
console.log(add(2,3));


// Cashing Module 
// Be Default Node Cahses the module being called and hence it is loaded only once
require('./modules/calculator_module_3')();
require('./modules/calculator_module_3')();
require('./modules/calculator_module_3')();
// Module Is Called 3 times but it only shows log once.
