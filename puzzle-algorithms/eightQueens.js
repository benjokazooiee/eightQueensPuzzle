function getCellNumberFromCoords(cellX, cellY) {
  return 8 * cellY + cellX;
}

function addToQueenSafeCells(singleQueenState, queenIndexNumber, cellNumber) {
  singleQueenState[queenIndexNumber].push(cellNumber);
}

function populateSingleQueenState(singleQueenState) {
  //create queen state container
  for (let i = 0; i < 8; i++) {
    singleQueenState.push([]);
  }
  //Create the chessboard cells and assign them to their queens
  for (let cellNumber = 0; cellNumber < 64; cellNumber++) {
    let x = cellNumber % 8;
    let y = Math.floor(cellNumber / 8);
    if (x === y) {
      addToQueenSafeCells(singleQueenState, x, cellNumber);
    } else {
      addToQueenSafeCells(singleQueenState, x, cellNumber);
      addToQueenSafeCells(singleQueenState, y, cellNumber);
    }
  }
}

function leastRemainingSafeQueenIndex(singleQueenState) {
  let targetQueenIndex;
  let singleQueenStateCopy = deepCopy(singleQueenState);
  //create an array containing the length of each queen's remaining safe cells
  let safeCellLengths = singleQueenStateCopy.map(
    (queenSafeCells) => queenSafeCells.length
  );
  //Filter to retain only the subarrays that have cells remaining
  let lengthsForMin = safeCellLengths.filter(
    (safeCellLength) => safeCellLength > 0
  );
  //get the smallest length
  let minValue = Math.min(...lengthsForMin);
  let leastRemainingSafeQueenIndexes = [];
  //add each of cell sets that have a length matching the minimum
  for (let queen of singleQueenStateCopy) {
    if (queen.length === minValue) {
      leastRemainingSafeQueenIndexes.push(singleQueenStateCopy.indexOf(queen));
    }
  }
  //if there was only one cell set that matched, return it
  if (leastRemainingSafeQueenIndexes.length === 1) {
    return leastRemainingSafeQueenIndexes[0];
  } else {
    //tie breaker for cell set lengths
    //go through the leastReamining safe indexes, comparing two values at a time
    for (let i = 0; i <= leastRemainingSafeQueenIndexes.length - 2; i++) {
      //get the indexes of two queens with tying lengths
      let firstQueenIndex = leastRemainingSafeQueenIndexes[i];
      let secondQueenIndex = leastRemainingSafeQueenIndexes[i + 1];
      //From the queenState, get 2 contiguous sets of 3 queens
      //The least remaining safe queens being examined are placed in the middle
      let firstQueenPrior = singleQueenStateCopy[firstQueenIndex - 1];
      let firstQueen = singleQueenStateCopy[firstQueenIndex];
      let firstQueenPost = singleQueenStateCopy[firstQueenIndex + 1];

      let secondQueenPrior = singleQueenStateCopy[secondQueenIndex - 1];
      let secondQueen = singleQueenStateCopy[secondQueenIndex];
      let secondQueenPost = singleQueenStateCopy[secondQueenIndex + 1];

      let firstQueenSet = [firstQueenPrior, firstQueen, firstQueenPost];
      let secondQueenSet = [secondQueenPrior, secondQueen, secondQueenPost];

      //if any of the queens in the contiguous sets are empty or our of bounds, then give them a value
      for (let i = 0; i <= firstQueenSet.length - 1; i++) {
        let inverseMod = minValue;
        if (firstQueenSet[i] === undefined || firstQueenSet[i] === null) {
          firstQueenSet[i] = [];
          firstQueenSet[i].length = Math.floor(
            firstQueenSet[1].length + firstQueenSet[1].length * (1 / inverseMod)
          );
        }
        if (
          secondQueenSet[i] === undefined ||
          secondQueenSet[i] === undefined
        ) {
          secondQueenSet[i] = [];
          secondQueenSet[i].length = Math.floor(
            secondQueenSet[1].length +
              secondQueenSet[1].length * (1 / inverseMod)
          );
        }
      }
      //Sum the safeCells of each contiguous set
      let firstQueenSumStart = 0;
      let firstQueenSumResult = firstQueenSet.reduce(
        (sum, currentQueenSafeCells) => {
          return (sum += currentQueenSafeCells.length);
        },
        firstQueenSumStart
      );

      let secondQueenSumStart = 0;
      let secondQueenSumResult = secondQueenSet.reduce(
        (sum, currentQueenSafeCells) => {
          return (sum += currentQueenSafeCells.length);
        },
        secondQueenSumStart
      );
      //Set the target index to the queen from the contiguous set that has the lowest sum of cells
      if (firstQueenSumResult <= secondQueenSumResult) {
        targetQueenIndex = firstQueenIndex;
      } else {
        targetQueenIndex = secondQueenIndex;
      }
    }
  }
  return targetQueenIndex;
}

function removeCellByNumber(singleQueenState, cellNumber) {
  let cellX = cellNumber % 8;
  let cellY = Math.floor(cellNumber / 8);
  if (cellX === cellY) {
    let indexOfCellToRemove = singleQueenState[cellX].indexOf(cellNumber);
    if (indexOfCellToRemove > -1)
      singleQueenState[cellX].splice(indexOfCellToRemove, 1);
  } else {
    let indexOfFirstCellToRemove = singleQueenState[cellX].indexOf(cellNumber);
    if (indexOfFirstCellToRemove > -1)
      singleQueenState[cellX].splice(indexOfFirstCellToRemove, 1);
    let indexOfSecondCellToRemove = singleQueenState[cellY].indexOf(cellNumber);
    if (indexOfSecondCellToRemove > -1)
      singleQueenState[cellY].splice(indexOfSecondCellToRemove, 1);
  }
}

function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

function placeQueenOnCell(singleQueenState, queenIndex, attackingCell) {
  let cellX = attackingCell % 8;
  let cellY = Math.floor(attackingCell / 8);

  //remove safeCells for this queen
  singleQueenState[queenIndex].length = 0;

  //go through x and y coordinates to eliminate cells from other queens
  for (let countX = 0, countY = 0; countX <= 7; countX++, countY++) {
    //remove horizontal cells
    let horizontalCellNumber = getCellNumberFromCoords(countX, cellY);
    removeCellByNumber(singleQueenState, horizontalCellNumber);

    //remove vertical cells (this should be unecessary, I had the length idea above after I added this)
    let verticalCellNumber = getCellNumberFromCoords(cellX, countY);
    removeCellByNumber(singleQueenState, verticalCellNumber);

    //set variables for diagonal attacks
    let rightX = cellX + countX;
    let leftX = cellX - countX;
    let upY = cellY - countY;
    let downY = cellY + countY;

    //leftUp
    if (leftX !== cellX && leftX >= 0 && upY !== cellY && upY >= 0) {
      let targetCellNumber = getCellNumberFromCoords(leftX, upY);
      removeCellByNumber(singleQueenState, targetCellNumber);
    } //end leftUp

    //rightUp
    if (rightX !== cellX && rightX <= 7 && upY !== cellY && upY >= 0) {
      let targetCellNumber = getCellNumberFromCoords(rightX, upY);
      removeCellByNumber(singleQueenState, targetCellNumber);
    } //rightUp

    //rightDown
    if (rightX !== cellX && rightX <= 7 && downY !== cellY && downY <= 7) {
      let targetCellNumber = getCellNumberFromCoords(rightX, downY);
      removeCellByNumber(singleQueenState, targetCellNumber);
    } //rightDown

    //leftDown
    if (leftX !== cellX && leftX >= 0 && downY !== cellY && downY <= 7) {
      let targetCellNumber = getCellNumberFromCoords(leftX, downY);
      removeCellByNumber(singleQueenState, targetCellNumber);
    } //leftDown
  }
}

function checkSafety(singleQueenState, singlePartialSolutionState) {
  let tempBooleanSwitch = false;
  for (let i = 0; i <= singleQueenState.length - 1; i++) {
    if (singleQueenState[i].length > 0) {
      tempBooleanSwitch = true;
    }
    if (
      singlePartialSolutionState[i] === null &&
      singleQueenState[i].length < 1
    ) {
      return false;
    }
  }
  return tempBooleanSwitch;
}

function breadthFirstSearch(incomingQueenState, incomingPartialSolutionState) {
  //Initialize arrays for queue
  let partialSolutionStatesArray = [incomingPartialSolutionState];
  let queenStatesArray = [incomingQueenState];
  let finalSolutions = [];

  //Start queue
  while (partialSolutionStatesArray.length > 0) {
    //Initialize variables for placing queen
    let targetPartialSolutionState = deepCopy(partialSolutionStatesArray[0]);
    let targetQueenState = queenStatesArray[0];
    let targetQueenStateCopy = deepCopy(targetQueenState);
    let targetQueenIndex = leastRemainingSafeQueenIndex(targetQueenState);
    let targetQueenSafeCells = targetQueenStateCopy[targetQueenIndex];

    //Go through each cell for the queen
    for (let attackingCell of targetQueenSafeCells) {
      let placeQueenTargetQueenStateCopy = deepCopy(targetQueenStateCopy);

      //Place queen on attackingCell
      placeQueenOnCell(
        placeQueenTargetQueenStateCopy,
        targetQueenIndex,
        attackingCell
      );
      let placeQueenTargetPartialSolutionState = deepCopy(
        targetPartialSolutionState
      );
      placeQueenTargetPartialSolutionState[targetQueenIndex] = attackingCell;

      //store safety state
      let breadthSafeState = checkSafety(
        placeQueenTargetQueenStateCopy,
        placeQueenTargetPartialSolutionState
      );
      //check safety
      if (breadthSafeState) {
        //if safe and null values in the solution remain, add the state to the end of the queue
        if (placeQueenTargetPartialSolutionState.includes(null)) {
          queenStatesArray.push(placeQueenTargetQueenStateCopy);
          partialSolutionStatesArray.push(placeQueenTargetPartialSolutionState);
        }
      } //end ifBreadth

      //if the solution is completely full, add it to final solutions
      if (!placeQueenTargetPartialSolutionState.includes(null)) {
        finalSolutions.push(placeQueenTargetPartialSolutionState);
      }
    } //end forLoop

    //after going through the current partial solution state and queen state, delete them from queue
    queenStatesArray.shift();
    partialSolutionStatesArray.shift();
  } //end whileLoop

  //sort each solution in ascending order
  for (let solution of finalSolutions) {
    solution.sort((a, b) => a - b);
  }

  //sort the solutions in ascending order
  for (let i = 7; i >= 0; i--) {
    finalSolutions.sort((a, b) => a[i] - b[i]);
  }

  //filter out duplicate results
  for (let i = finalSolutions.length - 2; i >= 0; i--) {
    //Grab a solution and the solution after it
    let firstSolution = finalSolutions[i];
    let secondSolution = finalSolutions[i + 1];
    let deleteBoolean = true;
    //compare each value, if they are not the same, then it shouldn't be deleted
    for (let j = 0; j <= firstSolution.length - 1; j++) {
      if (firstSolution[j] !== secondSolution[j]) {
        deleteBoolean = false;
        break;
      }
    }
    //if you got through the comparison and deleteBoolean is still true, remove the solution from finalSolutions
    if (deleteBoolean) {
      finalSolutions.splice(i + 1, 1);
    }
  }
  return finalSolutions;
} //end BFS

function solveEightQueens() {
  let startingsingleQueenState = [];
  populateSingleQueenState(startingsingleQueenState);
  let startingpartialSolutionState = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  let result = breadthFirstSearch(
    startingsingleQueenState,
    startingpartialSolutionState
  );
  console.log(`result (${result.length} solutions):`);
  console.log(result);
}

solveEightQueens();
