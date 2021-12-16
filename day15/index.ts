import { Console } from "console";
import { readFile } from "fs";
import { promisify } from "util";
import { resourceLimits } from "worker_threads";
const readFilePromise = promisify(readFile);

const input = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

type positions = Array<Array<number>>;
type coordinate = {x: number, y: number };
type path = Array<coordinate>;

const vertices: positions = input
  .split('\n')
  .map(line => line.split('').map(i => parseInt(i, 10)));

// travelling salesman problem: go from position -1,0 to vertices.length,vertices[max].length
// using the least 'risk level' numbers of the positions visited

const start: coordinate = { x: -1, y: 0 };// top left just before the first line
const end: coordinate = { x: vertices.length, y: vertices[vertices.length-1].length};

const results = findPath(start, new Array<coordinate>(), vertices);
console.log('paths leading to the finish: ', results);


function isSameCoordinate(a: coordinate, b: coordinate) {
  return a.x === b.x && a.y === a.y;
}

function findPath(position: coordinate, travelledPath: path, positions: positions): Array<path | undefined> {
  console.log('visiting...', travelledPath);
  // if our current coordinate is the end coordinate we are done
  if (isSameCoordinate(position, end)) {
    return [travelledPath]; // we have found a route, return the path
  }
  // recursion starts here
  
  // TODO implement
  const nextPossiblePositions = getPossibleNextPositions(position, travelledPath, positions);
  if (nextPossiblePositions.length === 0) {
    // we did not make it to the final coordinate
    return [undefined];
  }

  // for each next possible position we branch the path to multiple paths
  return nextPossiblePositions.map(nextPos => {
    const path = travelledPath.concat([nextPos]);
    return findPath(nextPos, path, positions); // lets try to find the end
  })
  .flat()
  .filter(path => path === undefined); // filter out the failed paths
}


function getPossibleNextPositions(position: coordinate, travelledPath: path, positions: positions): Array<coordinate> {
  // return all the coordinates we can still visit which we have not yet visited
  const allPositions = [
    { x: position.x-1, y: position.y },// ABOVE current position
    { x: position.x, y: position.y-1}, // LEFT
    { x: position.x, y: position.y+1}, // RIGHT
    { x: position.x+1, y: position.y }, // BELOW
  ];
  const maxX = positions.length;
  const maxY = positions[maxX-1].length;

  function isOutOfBounds(pos: coordinate) {
    return pos.x < 0 
      || pos.x > maxX
      || pos.y < 0
      || pos.y > maxY;
  }

  function isAlreadyVisited(pos: coordinate) {
    return travelledPath.some(path => isSameCoordinate(path, pos));
  }

  const result = allPositions
    .filter(isOutOfBounds)
    .filter(pos => !isAlreadyVisited(pos));
  return result;
}