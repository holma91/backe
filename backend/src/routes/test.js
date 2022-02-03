import { createRequire } from 'module'; // Bring in the ability to create the 'require' method in es6 modules
const require = createRequire(import.meta.url); // construct the require method
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env);
