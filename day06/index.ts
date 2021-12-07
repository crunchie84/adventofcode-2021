import { Console } from "console";
import { readFile } from "fs";
import { promisify } from "util";
import { resourceLimits } from "worker_threads";
const readFilePromise = promisify(readFile);

test([5], [4]);
test([0], [6,8]);
testRunningDays([3,4,3,1,2], 18, 26);

readFilePromise('./input.txt','utf8')
  .then(file => file.split(',').map(i => parseInt(i, 10)))
  .then(input => run(input, 80))
  .then(output => console.log(`total school after 80 days: ${output.length}`));


function testRunningDays(input: Array<number>, days: number, expectedTotalFIshOutput: number) {
  const result = run(input, days);
  if(result.length !== expectedTotalFIshOutput) {
    console.error(`❌ size of final school mismatch after x evolutions. Expected: ${expectedTotalFIshOutput}, got: ${result.length}`);
    return process.exit(1);
  }
  console.log('✅ test of evaoluations passed...');
}


function test(input: Array<number>, expectedOutput: Array<number>) {
  const actual = calculateNextTick(input);

  if (expectedOutput.length != actual.length){
    console.error(`❌ size of school mismatch! expected: ${expectedOutput.length}, actual: ${actual.length}`);
    return process.exit(1);
  }

  expectedOutput.forEach((expectedElValue, idx) => {
    if (actual[idx] != expectedElValue) {
      console.error(`❌ age of fish idx ${idx} mismatch, expected: ${expectedElValue}, actual: ${actual[idx]}`);
      return process.exit(1);
    }
  });

  console.log('✅ test passed...');
}

function run(state: Array<number>, days: number): Array<number> {
  for(let i=0; i< days; i++) {
    state = calculateNextTick(state);
  }
  return state;
}


function calculateNextTick(current: Array<number>): Array<number> {
  const newFishBorn = 8;
  const nextIteration: Array<number> = current.reduce((acc, currentFishCurrentTick) => {
    let currentFishNextTick = currentFishCurrentTick - 1;
    if(currentFishNextTick === -1) {
      currentFishNextTick = 6; // reset timer + spawn new fish
      acc.push([currentFishNextTick, newFishBorn]);
    }
    else {
      acc.push([currentFishNextTick])
    }
    return acc;
  }, new Array<Array<number>>())
  .flat();
  
  return nextIteration;
}