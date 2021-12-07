import { readFile } from "fs";
import { promisify } from "util";

const readFilePromise = promisify(readFile);

parseReadingsFromFile("./input.txt")
  .then((sonarDepthReadings) => countIncreases(sonarDepthReadings))
  .then((increases) => console.log(`Part one - Total increases: ${increases}`));

// part two, reduce the input to triplets, sum them together
parseReadingsFromFile("./input.txt")
  .then((sonarDepthReadings) => mapReadingsToTriplets(sonarDepthReadings))
  .then((sonarDepthReadings) => countIncreases(sonarDepthReadings))
  .then((increases) => console.log(`Part Two - Total increases: ${increases}`));

function parseReadingsFromFile(file: string): Promise<Array<number>> {
  return readFilePromise("./input.txt", "utf8")
    .then((content) => content.split("\n"))
    .then((lines) => lines.map((line) => parseInt(line, 10)));
}

function countIncreases(sonarDepthReadings: Array<number>): number {
  return sonarDepthReadings.reduce(
    (accumulator, currentReading) => {
      if (accumulator.previousReading && currentReading > accumulator.previousReading) {
        accumulator.increases++;
      }

      accumulator.previousReading = currentReading;
      return accumulator;
    },
    { previousReading: undefined, increases: 0 } as {
      previousReading?: number;
      increases: number;
    }
  ).increases;
}

function mapReadingsToTriplets(readings: Array<number>): Array<number> {
  return readings
    .map((_, currentIndex) => {
      const currentValue = readings[currentIndex];
      const secondValue = readings[currentIndex + 1];
      const thirdValue = readings[currentIndex + 2];
      if (secondValue === undefined || thirdValue === undefined) {
        return undefined;
      }
      return currentValue + secondValue + thirdValue;
    })
    .filter(
      (slidingWindowValue) => slidingWindowValue != undefined
    ) as Array<number>;
}
