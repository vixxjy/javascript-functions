//complete the function named seed that returns its arguments in an array.
function seed(...arg) { return arg}

//Complete the function named same that accepts two cells 
//and returns a Boolean indicating if the two cells are the same.
function same([x, y], [j, k]) { return x === j && y === k}

// Complete the function named contains that tests if the supplied cell is alive in the passed game state.
// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) { return this.some(x => same(x,cell))}

// Complete the function printCell that returns a string representation of a cell's state (is it alive or not?). 
const printCell = (cell, state) => { return contains.call(state, cell) ? "\u25A3" : "\u25A2"};

//Complete the function corners that calculates the top-right and bottom-left 
//coordinates of the smallest rectangle that contains all living cells. 
const corners = (state = []) => {
  if (state.length === 0) {
    return {
      topRight: [0,0],
      topLeft: [0,0]
    }
  }

  const xs = state.map(([x, _]) => x);
  const ys = state.map(([y, _]) => y);

  return {
    topRight: [Math.max(...xs), Math.max(...ys)],
    topLeft: [Math.min(...xs), Math.min(...ys)]
  }
};
//Complete the function printCells that uses the printCell and corners functions 
//completed previously to build a string representation of the game state. 
const printCells = (state) => {
  const { bottomLeft, topRight} = corners(state)
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for(let x = bottomLeft[0]; x <= topRight[0]; x++){
      row.push(printCell([x,y], state))
    }
    accumulator += row.join(" ") + "\n";
  }

  return accumulator;
};

//Complete the single-line arrow function getNeighborsOf that 
//returns an array containing all of the neighbors of a given cell.

const getNeighborsOf = ([x, y]) => {
  [x-1, y+1], [x, y+1], [x+1, y+1],
  [x-1, y],             [x+1, y],
  [x-1, y-1], [x, y-1], [x+1, y-1]
};

//Complete the function getLivingNeighbors that 
//returns the living neighbors of a given cell within a given game state. 
const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((n) => contains.bind(state)(n));
};

//Complete the function willBeAlive that calculates if a given cell will be alive in the next game state.
const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);

  return(
    livingNeighbors.length === 3 || (contains.call(state,cell) &&
    livingNeighbors.length === 2)
  )
};

//Complete the function calculateNext that calculates the next state of the game from the current state of the game.
const calculateNext = (state) => {
  const {bottomLeft, topRight}  = corners(state);
  let result = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y-- ) {
    for(let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      result = result.concat(willBeAlive([x,y], state) ? [[x, y]] : []);
    }
  }
  return result;
};

//Complete the function iterate that calculates new game states, based on a starting game state.
const iterate = (state, iterations) => {
  const states = [state];
  for(let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length - 1]));
  }

  return states;
};

//Complete the function main that calculates a given number of future states from a given starting 
//states and prints them all to the console (including the initial state).
const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach(a => console.log(printCells(a)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;