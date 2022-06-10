# Eight Queens Puzzle

*Copyright (C) 2022 Ben Third*
*Open Source Licensing Information Below*

> **My appreciation goes to the following people:**
> 
> Russ and Jason - For being my rubber ducks as I worked through this problem.
> 
> Erika - For being a great friend who fueled my tank and made sure I took time to rest.
> 
> Maddie - For helping me see the right path to take
> 
> And most of all: Greyson - My son, my reason for everything I do. The ultimate motivator.

## Table of Contents

- [Eight Queens Puzzle](#eight-queens-puzzle)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
    - [1.1 About the Puzzle](#11-about-the-puzzle)
    - [1.2 Purpose of Exercise](#12-purpose-of-exercise)
  - [2. The Algorithms](#2-the-algorithms)
    - [2.1 eightQueens](#21-eightqueens)
      - [2.1.1 eightQueens Approach](#211-eightqueens-approach)
      - [2.1.2 eightQueens Data Structure](#212-eightqueens-data-structure)
      - [2.1.3 eightQueens Steps](#213-eightqueens-steps)
    - [2.2 nQueens](#22-nqueens)
      - [2.2.1 nQueens Approach](#221-nqueens-approach)
      - [2.2.2 nQueens Data Structure](#222-nqueens-data-structure)
      - [2.2.3 nQueens Steps](#223-nqueens-steps)
  - [3. Conclusion](#3-conclusion)
    - [3.1 Comparing Algorithms](#31-comparing-algorithms)
    - [3.2 Contact Me](#32-contact-me)
    - [3.3 Licensing](#33-licensing)

## 1. Introduction

### 1.1 About the Puzzle

The eight queens puzzle is an exercise where you put eight queens on a board in a manner where none of them are attacking each other. A good metaphor would be that you’re placing a set of eight defensive towers on a piece of land. You split your land into an 8 x 8 grid and your goal is to place them so they can attack in all 8 directions without hitting each other.

With the eight queens puzzle, there are 92 solutions out of over 4.4 billion possible combinations. Out of the 92 solutions, there are 80 that you can rotate or reflect to replicate some other solution. The other 12 solutions can not be mirrored or reflected to replicate another solution - they are called the fundamental solutions. In this algorithm, we are solving for all 92 solutions.

The eight queens puzzle can be abstracted to an n-queens puzzle. For the n-queens puzzle, you take any number *n* and use that number to determine the dimensions of the grid you’re using as well as the number of queens you’re placing. The number of computations required to solve the n-queens puzzle increases dramatically each time you increase *n*.

> *Note*
> 
> I was learning about design patterns when I stumbled across the concept. I was fascinated by the concept and decided I would tackle it after completing my task at hand. I wanted to creatively and efficiently work with data by solving this problem on my own, so I didn’t do any research before attempting to solve this puzzle. I was even more fascinated by what I learned afterward!

### 1.2 Purpose of Exercise

There are a lot of pieces of data that you could go through with the eight queens puzzle. There are 64 tiles and eight queens. The binomial coefficient (n choose k) is 64 choose 8, which leads to the result mentioned above of more than 4 billion combinations. You can also use horizontal coordinates and vertical coordinates instead of tiles to decide where the queens go. This changes the binomial coefficient to 8 choose 8, which leads to a result of almost 17 million combinations. Either way, due to the sheer volume of combinations, solving this problem is computationally expensive. 

The challenge of this exercise is to manage the large number of combinations. The purpose is to learn how to creatively apply data structures and algorithms in a computationally efficient manner.

> **Calculating Binomial Coefficient**
> 
> A binomial coefficient is 2 numbers, n and k, where k is the length of combinations you are building and n is the total number of elements that you can make combinations out of. To get the results, first calculate (n-k)! -. Then, get the k! product: multiply k! by that factorial result: k!(n-k)!. Then, calculate the n-factorial (n!). Finally, take the n-factorial and divide it by k! product to get the result: n!/k!(n-k)!

## 2. The Algorithms

I’ve written up two algorithms for this puzzle. The first one I wrote is eightQueensSolutions. After I finished it, I wasn’t happy with it and had an idea for another approach, which is n-QueensSolutions. Both solutions took a similar structural approach. I used bottom-up dynamic programming to apply a corecursive breadth-first search with constraints that prunes options for future placement. Because of the pruning process, both approaches have polynomial computational complexity, though they both have minor differences. 

The concepts and data structures for each algorithm are explained below. The source code for each algorithm has well-commented blocks of code and well-named functions, so it should be readable. If you have any questions, please find the Contact Me section below to email me.

### 2.1 eightQueens

#### 2.1.1 eightQueens Approach

Each tile is numbered 0 to 63. Each queen has its row and column that it can be placed on. By dividing a tile by the number of columns and rounding down, you can get the vertical coordinate - taking the remainder instead of rounding down will give you the horizontal coordinate. Those coordinates are used to assign tiles to the queen domains. For example, Queen 0 can be placed on either row or column 0. There is also an array to track the tiles that each queen is placed on as it is placed called partial solutions.

Next, we create data structures to set up a queue, where the queue is cycling through an array of partial solutions and an array of safe tiles for the queens. The algorithm starts by placing Queen 3 - we place the queen on the first tile, remove the attacked tiles from other queens, then check if there are solutions remaining or if the solution is complete.

If there are solutions remaining, we add both pieces of new data to the queue. If the solution is complete, we add the solution to final solutions. After that, we go to the next available tile for Queen 3 and repeat the process until all tiles have been exhausted. Finally, we shift both of the queues and the loop starts again, but the next queen that is placed is the one with the least remaining safe tiles. 

This continues until the queues are empty. At that point, we have all 92 solutions.

> **Notes about this approach:**
> 
> Because the algorithm can randomly bounce to the next target queen to place, this is a greedy algorithm that creates duplicate results. These duplicate results will add a lot of unnecessary computations. Beyond that, after getting the solutions you have to sort each individual solution subarray, then sort all of the solutions in the containing array, and finally remove any duplicates you find. As a result, this algorithm might be a little more efficient for small numbers of queens, but as you increase the number of queens and the size of the board, the duplicate results may lead to an overwhelming number of unnecessary computations.
>
> There were a lot of things I could have done to make this a better algorithm. For example, I named all of the chessboard spaces to be cells instead of tiles. I also put a lot of data in this one, the next one has far less data by tracking columns and rows instead of tiles. Overall, I wasn’t extremely happy with this algorithm. That’s why I decided to make the n-queens algorithm. I’ve included the eightQueens algorithm to show the improvements.

#### 2.1.2 eightQueens Data Structure

- queenState represents each queen and their tiles
  - queenSafeCells represents a single queen’s available tiles
  - attackingCell represents the tile that the queen is being placed on
- partialSolutionState represents the tiles that the queens are placed on
- partialSolutionStatesArray and queenStatesArray are used for the queue
- finalSolutions is the container that each completed solution is added to
- breadthSafeState determines if the solution that we added to has remaining solutions

#### 2.1.3 eightQueens Steps

1. Create queenState and partialSolutionState
2. Create queue arrays and add their respective states as the only element
3. Start a loop that goes through the queue arrays until they’re empty
  1. Copy the target states
  2. Find the target queen to be placed - the one with the least remaining safe tiles
  3. Go through each tile that is available to the queen
    1. Place the queen on the tile - remove attacked tiles from other queen’s tiles
    2. Assign the tile to the partial solution
    3. Check if there are still solutions remaining
      1. If so, add both of the new and modified states to their queue arrays
      2. If it’s complete, then add the solutions to the final solutions
  4. Shift both of the queue arrays

### 2.2 nQueens

#### 2.2.1 nQueens Approach

With the n-QueenSolutions approach, we abstracted the board and the number of queens. The function is called with an input number that decides the number of queens and the grid size. We build a solution state with a length equal to the input number and fill it with null values - each index is the horizontal coordinate while each value is the vertical coordinate. Then, we make a state to track the vertical coordinates that a queen can be placed on for each horizontal coordinate.

After creating the states based on the input number, we split the elements in the solution state in two, grouping by parity type. We also sort the elements in each of those grouped arrays so that they start with the middle index and work their way out. For example, with 8 queens and indexes 0-7, the odd set of horizontal coordinates would be [3, 5, 1, 7] and the even would be [4, 2, 6, 0]. We always go through the odd coordinates first, then the even ones. Next, we set up the data for the queue and start it.

Within the queue, we go through the available vertical coordinates of the targeted horizontal coordinate. Combining these coordinates will give you the tile that you’re placing the queen on. At the solution state index representing the targeted horizontal coordinate, change the value to the vertical coordinate. Remove the vertical coordinates that the newly placed queen is attacking from the available vertical coordinates state. Check if the solution state is safe or complete. If it’s complete, add the result to a group of completed solutions that will be displayed later. If it’s safe, add the result to the end of queue arrays. We repeat this process until each available vertical coordinate has gone through the process, with its resulting states dealt with appropriately.

We shift both of the arrays before the queue starts back over. Finally, when the loops are completed, we return the completed solutions that were built.

#### 2.2.2 nQueens Data Structure

- inputNumber is the number of queens we’re placing as well as the dimensions of the board
 solutionState represents the horizontal and vertical coordinates of each queen that was placed. The inputNumber is used to build it.
  - Each index is the horizontal coordinate and the value found there is the vertical coordinate
  - oddHorizontalCoordTrack is every odd horizontal coordinate, starting from the center and working its way out.
  - evenHorizontalCoordTrack is every even horizontal coordinate, starting from the center and working its way out.
- verticalCoordsAvailableState represents each vertical coordinate that a queen can be placed on at a given horizontal coordinate. The inputNumber is used to build it.
- solutionStatesArray and verticalCoordsAvailableStatesArray are used for the queue
- Coordinates labeled with placement represent the coordinates the queen is being placed on
- Coordinates labeled with clear represent coordinates that will be removed

#### 2.2.3 nQueens Steps

1. Create solutionState and verticalCoordsAvailableState
2. Create the odd and evenHorizontalCoordTrack
3. Create both statesArrays and add their respective states as their only element
4. Start the queue
  1. Copy both states
  2. Determine which parity track we’re on
  3. Get the placementHorizontalCoordinate
  4. Go through each vertical coordinate that the queen can get placed on for the placementHorizontalCoordinate
    1. Clear the availableVerticalCoordinates that belong to the placementHorizontalCoordinate
    2. For each other horizontal coordinate, remove its vertical coordinates that were made vulnerable by this queen
    3. Check the safe and complete states
      1. If complete, push the result to final solutions
      2. If safe, add both of the new and modified states to their respective arrays
  5. Shift both stateArrays
5. Return finalSolutions

## 3. Conclusion

Overall, this was an interesting, fun, and challenging project. I learned a lot and got better at programming in the process. After I finished both algorithms, I learned more about problem solving techniques. It was fascinating to see all the different strategies that can be used to tackle problems. Overall, this ended up being a much more significant project than I originally thought it would be. I’m glad I did it!

### 3.1 Comparing Algorithms

The n-Queens algorithm is easily the better one in my opinion. 

The variables are named better, so it’s much easier to understand what is happening in the code. The problem is abstracted, so you can solve it for any number of queens (provided you have the computational resources to do so). The data set is much smaller in the n-Queens algorithm, which makes it faster. Also, we didn’t use the least remaining safe tiles to decide the next queen to be placed - that prevents the greediness of the algorithm, which can cause significant overhead as n gets higher. There are still improvements that I could make to the n-Queens algorithm, but overall, I’m happy with the result.

### 3.2 Contact Me

I’m interested in hearing your thoughts on the project! If you have an questions or feedback for me regarding the source code or documentation, please email me at <benthird33@gmail.com>

### 3.3 Licensing

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.