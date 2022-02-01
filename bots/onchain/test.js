import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const data = require('./random_data/eth_addresses.json'); // use the require method

console.log(data);
