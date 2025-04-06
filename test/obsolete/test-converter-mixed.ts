// Test script for tana-converter.ts - mixed colon usage

import fs from 'fs';
import { convertToTana } from '../src/utils/tana-converter';

// Read test file
const testFile = fs.readFileSync('./test/test-mixed-colons.md', 'utf-8');

// Convert and log result
const result = convertToTana(testFile);
console.log("INPUT:");
console.log("-------");
console.log(testFile);
console.log("\nOUTPUT:");
console.log("-------");
console.log(result); 