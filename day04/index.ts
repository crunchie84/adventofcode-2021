import { Console } from "console";
import { readFile } from "fs";
import { promisify } from "util";
const readFilePromise = promisify(readFile);

type bingoCard = Array<Array<number>>;

function runBingo(cards: Array<bingoCard>, numberSequence: Array<number>) : number | undefined {
  const drawnNumbers = new Array<number>();
  for (let i=0; i<numberSequence.length; i++) {
    drawnNumbers.push(numberSequence[i]);
    const cardsWithBingo = cards
      .filter(card => hasBingo(card, drawnNumbers))
      .map(card => ({ card, score: drawnNumbers[i] * calculateSumOfUnMarkedNumbers(card, drawnNumbers)}));
    
    if(cardsWithBingo.length > 0){
      console.log('We have a winner!', JSON.stringify(cardsWithBingo[0]));
      return cardsWithBingo[0].score;
    }
  }
  console.log('so sad, no winners...');
  return undefined;
}


function hasBingo(card: bingoCard, drawnNumbers: Array<number>): boolean {
  // find a horizontal row which has bingo
  return allNumbersInRowDrawn(card, drawnNumbers) === true ||
    /* translate vertical-horizontal so we can re-use same logic for vertical matches */
    allNumbersInRowDrawn(translateArray(card), drawnNumbers) === true;
}

function allNumbersInRowDrawn(card: bingoCard, drawnNumbers: Array<number>): boolean {
  return card
    .find(row => row
      .every(nr => drawnNumbers
        .find(drawn => drawn === nr)
      )
    ) !== undefined;
}

function translateArray(input: bingoCard): bingoCard {
  /*
    convert [
      [1,2]
      [3,4]
    ]
    into
    [
      [1,3]
      [2,4]
    ]
  */
  return input.reduce((acc, curr) => {
    curr.forEach((currEl,currIdx) => {
      if(!acc[currIdx]) {
        acc[currIdx] = new Array<number>();
      }
      acc[currIdx].push(currEl);
    });
    return acc;
  }, new Array<Array<number>>());
}

function calculateSumOfUnMarkedNumbers(card: bingoCard, drawnNumbers: Array<number>): number {
  return card.reduce((acc, currRow) => {
    return acc += currRow
      .filter(rowNr => drawnNumbers.find(drawnNr => drawnNr === rowNr) === undefined)
      .reduce((rowAcc, uncalledNr) => rowAcc += uncalledNr, 0);
  }, 0);
}

poorMansUnitTest();

readFilePromise('./input.txt', 'utf8')
  .then(input => console.log(`part one output: ${solvePuzzlePartOne(input)}`));


function parseInput(input: string): { numberSequence: Array<number>, cards: Array<bingoCard>} {
  const [unparsedNumbers, ...unparsedCards] = input.split('\n\n');

  return {
    numberSequence: unparsedNumbers.split(',').map(x => parseInt(x, 10)),
    cards: unparsedCards.map(unparsedCard => {
      return unparsedCard.split('\n').map(row => row.split(' ').filter(x => x !== '').map(x => parseInt(x, 10)));
    })
  }
}

function solvePuzzlePartOne(input: string): number | undefined {
  const parsedArgs = parseInput(input);
  return runBingo(parsedArgs.cards, parsedArgs.numberSequence); 
}

function poorMansUnitTest() {
  const input = `7,4,9,5,11,17,23,2,0,14,21,24

22 13 17 11  0
8  2 23  4 24
21  9 14 16  7
6 10  3 18  5
1 12 20 15 19

3 15  0  2 22
9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
2  0 12  3  7`;
  const expectedOutput = 4512;

  const result = solvePuzzlePartOne(input);
  
  if (result !== expectedOutput) {
    console.error(`Test FAILED: Expected: ${expectedOutput} but got: ${result}`);
    return process.exit(1);
  }
  console.log('Test passed...');
}


