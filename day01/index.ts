import { readFile } from "fs";
import { promisify } from "util";

const readFilePromise = promisify(readFile);

readFilePromise("./input.txt", "utf8")
  .then((content) => content.split("\n"))
  .then((lines) => lines.map((line) => parseInt(line, 10)))
  .then((sonarDepthReadings) => countIncreases(sonarDepthReadings))
  .then((increases) => console.log(`Part one - Total increases: ${increases}`));


// part two, reduce the input to triplets, sum them together
readFilePromise("./input.txt", "utf8")
  .then((content) => content.split("\n"))
  .then((lines) => lines.map((line) => parseInt(line, 10)))
  .then((sonarDepthReadings) => sonarDepthReadings
    .map((_, currentIndex) => {
        const currentValue = sonarDepthReadings[currentIndex];
        const secondValue = sonarDepthReadings[currentIndex + 1];
        const thirdValue = sonarDepthReadings[currentIndex + 2];
        if (secondValue === undefined || thirdValue === undefined) { 
            return undefined; 
        }
        return currentValue + secondValue + thirdValue;
    })
    .filter((slidingWindowValue => slidingWindowValue != undefined)) as Array<number>
  )
  .then(sonarDepthReadings => countIncreases(sonarDepthReadings))
  .then((increases) => console.log(`Part Two - Total increases: ${increases}`));

function countIncreases(sonarDepthReadings: Array<number>): number {
    return sonarDepthReadings.reduce(
        (accumulator, currentReading) => {
            if (accumulator.previousReading && currentReading > accumulator.previousReading ) {
            accumulator.increases++;
            }

            accumulator.previousReading = currentReading;
            return accumulator;
        },
        { previousReading: undefined, increases: 0 } as {
            previousReading?: number;
            increases: number;
        }
    )
    .increases;
}