import { readFile } from "fs";
import { promisify } from "util";
const readFilePromise = promisify(readFile);

poorMansUnitTest();

readFilePromise('./input.txt', 'utf8')
  .then(input => console.log(`part one output: ${solvePuzzlePartOne(input)}`));


function poorMansUnitTest() {
  const input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

  const expectedOutput = 198;

  const result = solvePuzzlePartOne(input);

  if (result !== expectedOutput) {
    console.error(`Test FAILED: Expected: ${expectedOutput} but got: ${result}`);
    return process.exit(1);
  }
  console.log('Test passed...');
}

function solvePuzzlePartOne(testInput: string): number {
  const gammaRate = reduceToMostSignificantBit(translateArray(testInput.split('\n')));
  const epsilonRate = flipBits(gammaRate); 

  return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
}

function flipBits(input: string): string {
  return input.split('').reduce((acc, curr) => { acc += (curr === '0' ? '1' : '0'); return acc; }, '');
}

function reduceToMostSignificantBit(input: Array<string>): string { 
  /**
   * given an array of
   * 0001
   * 0011
   * 1111
   * 
   * reduce this into
   * 001
   */
  return input.reduce((acc, curr, idx) => {
    // reduce the position of the array back into the most prevailing bit
    // curr = all bits for a position
    // acc = the most or least prevailing bit for that position
    acc[idx] = countOccurencesOfChar(curr, '0') > (curr.length / 2) ? '0' : '1';
    return acc;
  }, new Array<string>())
  .reduce((acc, curr) => acc += curr, '')
}

function translateArray(input: Array<string>): Array<string> {
  /**
   * convert: an array of: 
   * 000
   * 111
   * 111
   * 
   * into 
   * 011
   * 011
   * 011
   * 
   * so we can reduce this to the most significant bit
   */
  return input.reduce((acc, curr) => {
    curr.trim().split('').forEach((char, idx) => acc[idx] ?  acc[idx] += char : acc[idx] = char);
    return acc;
  }, new Array<string>())
}

function countOccurencesOfChar(haystack: string, needle: string): number {
  return haystack.split('').filter(c => c === needle).length;
}