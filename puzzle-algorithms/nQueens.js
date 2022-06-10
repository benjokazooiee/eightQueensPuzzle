/*
 * Solving Queens Puzzle
 */

/*
 ** Helper Functions
 */

/*
 *** deepCopy - unit tested -- no implementation tested needed
 */

function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

/*
 *** getMidHorizontalCoords - unit tested & implementation tested
 */

function getMidHorizontalCoords(solutionState) {
  //get midPoint
  let midPoint = (solutionState.length - 1) / 2;
  //get the index closest to the middle, rounding down if necessary
  let firstMiddleIndex = Math.floor(midPoint);
  //Get the secondMiddleIndex based on whether the firstMiddleIndex is below the midPoint before rounding
  let secondMiddleIndex =
    firstMiddleIndex < midPoint ? firstMiddleIndex + 1 : firstMiddleIndex - 1;

  //get the middleIndex that's even (if firstMiddleIndex is even, then the even is fMI, otherwise, it's sMI)
  let midEvenIndex =
    firstMiddleIndex % 2 === 0 ? firstMiddleIndex : secondMiddleIndex;

  //get the middleIndex that's odd (if firstMiddleIndex is not midEvenIndex, then the odd if fMI, otherwise it's sMI)
  let midOddIndex =
    firstMiddleIndex !== midEvenIndex ? firstMiddleIndex : secondMiddleIndex;

  //return both the even and odd middle indexes in an array
  return [midEvenIndex, midOddIndex];
}

/*
 *** getHorizontalCoordsTrack
 */

function getHorizontalCoordsTrack(midIndex, solutionState) {
  //Create the targetColumns array
  let retrievedHorizontalCoordsTrack = [];

  //add the midIndex
  retrievedHorizontalCoordsTrack.push(midIndex);

  //add the Indexes that have the same parity, starting with the higher one
  for (
    let upperIndexOnTrack = midIndex + 2, lowerIndexOnTrack = midIndex - 2;
    upperIndexOnTrack <= solutionState.length || lowerIndexOnTrack >= 0;
    upperIndexOnTrack += 2, lowerIndexOnTrack -= 2
  ) {
    if (upperIndexOnTrack <= solutionState.length - 1) {
      retrievedHorizontalCoordsTrack.push(upperIndexOnTrack);
    }
    if (lowerIndexOnTrack >= 0) {
      retrievedHorizontalCoordsTrack.push(lowerIndexOnTrack);
    }
  }

  return retrievedHorizontalCoordsTrack;
}

/*
 *** getCurrentParityTrack
 */

function getCurrentParityTrack(
  evenHorizontalCoords,
  oddHorizontalCoords,
  targetSolutionState
) {
  //if the oddTrack has null elements remaining, keep going through it. Otherwise, move to the evenTrack
  let evenTargetBoolean = true;
  for (let oddHorizontalCoord of oddHorizontalCoords) {
    if (targetSolutionState[oddHorizontalCoord] === null) {
      evenTargetBoolean = false;
    }
  }
  let targetParityTrack =
    evenTargetBoolean === true ? evenHorizontalCoords : oddHorizontalCoords;
  return targetParityTrack;
}

/*
 *** getHorizontalCoordinateForPlacement
 */
function getHorizontalCoordinateForPlacement(
  placementHorizontalCoordParityTrack,
  targetSolutionStateCopy
) {
  for (let coord of placementHorizontalCoordParityTrack) {
    if (targetSolutionStateCopy[coord] === null) {
      return coord;
    }
  }
}

/*
 *** removeVerticalCoord
 */

function removeVerticalCoord(
  verticalCoordRemoved,
  targetVerticalCoordTilesForRemoval
) {
  let verticalCoordRemovedIndex =
    targetVerticalCoordTilesForRemoval.indexOf(verticalCoordRemoved);
  if (verticalCoordRemovedIndex > -1) {
    targetVerticalCoordTilesForRemoval.splice(verticalCoordRemovedIndex, 1);
  }
}

/*
 *** removeDiagonals
 */

function removeDiagonals(
  horizontalCoordOfTileBeingPlaced,
  verticalCoordOfTileBeingPlaced,
  indexOfVerticalCoordsBeingRemoved,
  verticalCoordsBeingRemoved
) {
  //take distance between the column the queen is being placed on and the column having rows removed
  let distanceBetweenColumns = Math.abs(
    horizontalCoordOfTileBeingPlaced - indexOfVerticalCoordsBeingRemoved
  );

  //For higher row removed, add the distance to row the queen is being placed on. Lower is subtraction.
  let higherCoordRemoved =
    verticalCoordOfTileBeingPlaced + distanceBetweenColumns;
  let lowerCoordRemoved =
    verticalCoordOfTileBeingPlaced - distanceBetweenColumns;

  //remove each column with removeRow (it will automatically check index)
  removeVerticalCoord(higherCoordRemoved, verticalCoordsBeingRemoved);
  removeVerticalCoord(lowerCoordRemoved, verticalCoordsBeingRemoved);
}

/*
 *** checkSafety
 */

function checkSafety(
  solutionStateToExamine,
  verticalCoordsAvailableStateToExamine
) {
  let completeBoolean = true;
  let safeBoolean = true;
  for (let i = 0; i <= solutionStateToExamine.length - 1; i++) {
    if (solutionStateToExamine[i] === null) {
      //Null values mean the solution is incomplete
      completeBoolean = false;
      if (verticalCoordsAvailableStateToExamine[i].length < 1) {
        //if the value is null but there aren't any vertical coords available, it's not safe
        safeBoolean = false;
        return [completeBoolean, safeBoolean];
      }
    }
  }
  safeBoolean = completeBoolean === true ? false : safeBoolean;
  return [completeBoolean, safeBoolean];
}

/*
 ** findSolutions
 */
function findSolutions(solutionState, verticalCoordsAvailableState) {
  //Get the even and odd indexes closest to middle of solutionState - tested (don't change)
  let middleHorizontalCoords = getMidHorizontalCoords(solutionState);

  //get all odd horizontalCoords - tested (don't change)
  let middleOddCoord = middleHorizontalCoords[1];
  let oddHorizontalCoordTrack = getHorizontalCoordsTrack(
    middleOddCoord,
    solutionState
  );

  //get all even horizontalCoords - tested (don't change)
  let middleEvenCoord = middleHorizontalCoords[0];
  let evenHorizontalCoordTrack = getHorizontalCoordsTrack(
    middleEvenCoord,
    solutionState
  );

  //create finalSolutions array and the Arrays for the while loop - tested (don't change)
  let solutionStatesArray = [deepCopy(solutionState)];
  let verticalCoordsAvailableStatesArray = [
    deepCopy(verticalCoordsAvailableState),
  ];
  let finalSolutions = [];

  //start while loop:

  while (solutionStatesArray.length > 0) {
    //create copies of the states to modify (tested)
    let targetSolutionState = solutionStatesArray[0];
    let targetVerticalCoordsAvailableState =
      verticalCoordsAvailableStatesArray[0];
    let placementHorizontalCoordParityTrack = getCurrentParityTrack(
      evenHorizontalCoordTrack,
      oddHorizontalCoordTrack,
      targetSolutionState
    );

    // Find the index of the horizontalCoordinate we want to fill
    let placementHorizontalCoordinate = getHorizontalCoordinateForPlacement(
      placementHorizontalCoordParityTrack,
      targetSolutionState
    );

    // Go through each avaialableVerticalCoord for that single horizontalCoordinate
    for (let placementVerticalCoord of targetVerticalCoordsAvailableState[
      placementHorizontalCoordinate
    ]) {
      let targetSolutionStateCopy = deepCopy(targetSolutionState);
      let targetVerticalCoordsAvailableStateCopy = deepCopy(
        targetVerticalCoordsAvailableState
      );
      let placementVerticalCoordsAvailable =
        targetVerticalCoordsAvailableStateCopy[placementHorizontalCoordinate];
      // (placement loop) Change placementInTargetSolutionStateCopy to the availableVerticalCoord
      targetSolutionStateCopy[placementHorizontalCoordinate] =
        placementVerticalCoord;
      // (placement loop) Clear the array found at placementVerticalCoordsAvailable
      placementVerticalCoordsAvailable.length = 0;

      // (placement loop) start a `clear loop` going through the verticalCoordsAvaiable of targetVerticalCoordsAvailableStateCopy
      for (let clearLoopTargetVerticalCoords of targetVerticalCoordsAvailableStateCopy) {
        // (clear loop) define the index of verticalCoordsAvailable in targetVerticalCoordsAvailableStateCopy
        let indexOfClearLoopTargetVerticalCoords =
          targetVerticalCoordsAvailableStateCopy.indexOf(
            clearLoopTargetVerticalCoords
          );
        // (clear loop) if indexOfVerticalCoordsAvailable !== placementHorizontalCoordinate
        if (
          indexOfClearLoopTargetVerticalCoords !== placementHorizontalCoordinate
        ) {
          // (if not placementHorizontal's vertical coordinates) Clear the availableVerticalCoord
          removeVerticalCoord(
            placementVerticalCoord,
            clearLoopTargetVerticalCoords
          );
          // (if not placementHorizontal's vertical coordinates) Do diagonal removals, using the indexes in tSSC compared to placementHorizontalCoord to calculate distance and using the targetAvailableVerticalCoord as the base
          removeDiagonals(
            placementHorizontalCoordinate,
            placementVerticalCoord,
            indexOfClearLoopTargetVerticalCoords,
            clearLoopTargetVerticalCoords
          );
        }
      } //end clear loop

      // (placement loop) check the safety and complete states of targetSolutionStateCopy++targetverticalCoordsAvailableStateCopy
      let completeSafeStates = checkSafety(
        targetSolutionStateCopy,
        targetVerticalCoordsAvailableStateCopy
      );
      let completeState = completeSafeStates[0];
      let safeState = completeSafeStates[1];
      //If the solution is complete or safe, do the respective pushces
      if (completeState) {
        finalSolutions.push(targetSolutionStateCopy);
      } else if (safeState) {
        solutionStatesArray.push(targetSolutionStateCopy);
        verticalCoordsAvailableStatesArray.push(
          targetVerticalCoordsAvailableStateCopy
        );
      }
    }
    //delete the state we finished going through
    solutionStatesArray.shift();
    verticalCoordsAvailableStatesArray.shift();
  }
  return finalSolutions;
}

/*
 ** solveQueens Puzzle
 */

function solveQueensPuzzle(inputNumber) {
  //create solutionState
  let solutionState = [];
  solutionState.length = inputNumber;
  solutionState.fill(null);

  //create rowsAvailableState
  let verticalCoordsAvailable = [...Array(inputNumber).keys()];
  let verticalCoordsAvailableState = [];
  //filling with shallow copies for some reason!
  for (let i = 0; i <= inputNumber - 1; i++) {
    verticalCoordsAvailableState.push(deepCopy(verticalCoordsAvailable));
  }
  //fire findSolutions
  let result = findSolutions(solutionState, verticalCoordsAvailableState);
  console.log(`=====result====`);
  console.log(result);
  console.log(`result.length: ${result.length}`);
  console.log(`=====result====`);
}

solveQueensPuzzle(8);
