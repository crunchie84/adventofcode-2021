import { Console } from "console";
import { readFile } from "fs";
import { createImportSpecifier } from "typescript";
import { promisify } from "util";
const readFilePromise = promisify(readFile);

type coordinate = {
  x: number, 
  y: number
}

type line = {
  from: coordinate,
  to: coordinate
};

type grid = Array<Array<number>>;

poorMansUnitTest();

readFilePromise('./input.txt','utf8')
  .then(solvePuzzlePartOne)
  .then(result => console.log('part one output: ', result));

function solvePuzzlePartOne(input: string, renderDebugoutput=false): number {
  const parsed = parseInput(input);
  const rendered = renderVentsOnGrid(parsed);

  // debug
  if(renderDebugoutput) {
    renderGridOnConsole(rendered);
  }

  const pointsWithAtLeastTwoOverlaps = rendered.flat().filter(cel => cel > 1).length;
  return pointsWithAtLeastTwoOverlaps;
}

function initializeEmptyGrid(input: Array<line>): grid {
  const allCoordinates = input.map(line => [line.from, line.to]).flat();

  const maxX = max(allCoordinates.map(el => el.x));
  const maxY = max(allCoordinates.map(el => el.y));

  console.log('generating grid: ', maxX, maxY);

  // now initialize the grid
  const grid: grid = new Array<Array<number>>();
  for(let y=0;y<=maxY;y++){
    grid[y] = new Array<number>();
    for(let x=0;x<=maxX;x++){
      grid[y][x] = 0;
    }
  }
  return grid;
}

function max(input: Array<number>):number {
  return input.reduce((acc, curr) => acc > curr ? acc : curr, 0);
}

function renderGridOnConsole(grid: grid) {
  grid.forEach((line) => {
    line.forEach((cel,idx) => {
      process.stdout.write(cel === 0 ? '.' : cel.toString());
    })
    process.stdout.write('\n');
  });
}

function renderVentsOnGrid(input: Array<line>):Array<Array<number>> {
  const grid = initializeEmptyGrid(input);
  
  input
    .filter(line => isHorizontalLine(line) || isVerticalLine(line))
    .forEach(line => {
      if (isHorizontalLine(line)) {
        // find correct index of array, add positions in there
        const [startX, endX] = [line.from.x, line.to.x].sort((a,b) => a < b ? -1 : 1);
        assert(endX > startX, 'endX should always be bigger', {startX, endX});
        for (let x = startX; x <= endX; x++) {
          grid[line.from.y][x]++;
        }
        return;
      }

      // vertical line logic
      // for every vertical position find the outer array index, add position to it (increment?)
      const [startY, endY] = [line.from.y, line.to.y].sort((a,b) => a < b ? -1 : 1);
      assert(startY < endY, 'endY should always be bigger', {startY, endY});
      for (let y = startY; y <= endY; y++) {
        grid[y][line.from.x]++;
      }
    });
  return grid;
}

function assert(assertion: boolean, message: string,data: any) {
  if(!assertion) {
    console.log(message, data);
    throw new Error('Assertion failed: ' + message);
  };
}

function isHorizontalLine(line: line): boolean {
  // both coordinates are on same line, same Y
  return line.from.y === line.to.y;
}

function isVerticalLine(line: line): boolean {
  return line.from.x == line.to.x;
}

function parseInput(input: string) : Array<line> {
  return input.split('\n')
    .map(line => {
      const parts = line.split(' -> ')
        .map(coordinate => { 
          const parsedParts = coordinate.split(',').map(i => parseInt(i,10));
          return { x: parsedParts[0], y: parsedParts[1] };
         });
      return { from: parts[0], to: parts[1] };
    })
}

function poorMansUnitTest() {
  const input = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;
  const expectedOutput = 5;

  const result = solvePuzzlePartOne(input);
  
  if (result !== expectedOutput) {
    console.error(`Test FAILED: Expected: ${expectedOutput} but got: ${result}`);
    return process.exit(1);
  }
  console.log('Test passed...');
}


