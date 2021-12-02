import { readFile } from "fs";
import { promisify } from "util";
const readFilePromise = promisify(readFile);

poorMansUnitTest();
poorMansUnitTestPartTwo();

readFilePromise('./input.txt', "utf8")
  .then(parsePuzzleInputToCommands)
  .then(calculatePosition)
  .then((navigationResult) => console.log(`Part one - result: ${JSON.stringify(navigationResult)} -> ${navigationResult.depth * navigationResult.distance}`));

  readFilePromise('./input.txt', "utf8")
  .then(parsePuzzleInputToCommands)
  .then(calculatePositionPartTwo)
  .then((navigationResult) => console.log(`Part two - result: ${JSON.stringify(navigationResult)} -> ${navigationResult.depth * navigationResult.distance}`));


function parsePuzzleInputToCommands(content: string) {
  return content
    .split('\n')
    .map((line) => {
      const [ command, distance ] = line.split(' ');

      return {
        command,
        distance: parseInt(distance, 10)
      }
    });
}

function calculatePositionPartTwo(commands: Array<{ command: string, distance: number }>) {
  return commands.reduce((acc, currentValue) => {
    switch(currentValue.command) {
      case 'up': acc.aim -= currentValue.distance; return acc;
      case 'down': acc.aim += currentValue.distance; return acc;
      case 'forward': 
        acc.distance += currentValue.distance;
        acc.depth += (acc.aim * currentValue.distance);
        return acc;
      default: console.log('🤷‍♀️'); return acc;
    }
  }, { aim: 0, distance: 0, depth: 0});
}

function calculatePosition(commands: Array<{ command: string, distance: number }>) {
  return commands.reduce((acc, currentValue) => {
    switch(currentValue.command) {
      case 'up': acc.depth -= currentValue.distance; return acc;
      case 'down': acc.depth += currentValue.distance; return acc;
      case 'forward': acc.distance += currentValue.distance; ; return acc;
      default: console.log('🤷‍♀️'); return acc;
    }
  }, { distance: 0, depth: 0});
}

function poorMansUnitTest() {
  const testIntput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

  const output = calculatePosition(parsePuzzleInputToCommands(testIntput));
  if (output.depth != 10 || output.distance != 15) {
    console.error('incorrect parsing/logic applied, depth should be 10, distance should be 15 but got', output);
    return process.exit(1);
  }
  console.log('✅ unit test passed');
}

function poorMansUnitTestPartTwo() {
  const testIntput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

  const output = calculatePositionPartTwo(parsePuzzleInputToCommands(testIntput));
  if (output.depth != 60 || output.distance != 15) {
    console.error('incorrect parsing/logic applied, depth should be 60, distance should be 15 but got', output);
    return process.exit(1);
  }
  console.log('✅ unit test passed');
}