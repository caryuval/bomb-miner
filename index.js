const readline = require("readline");

async function play(rows, columns) {
  function constructBombArray(rows, columns) {
    const array = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push({
          hasBomb: randomBoolean(),
          isRevealed: false,
        });
      }
      array.push(row);
    }
    return array;
  }

  function randomBoolean() {
    return Boolean(Math.round(Math.random()));
  }

  function drawBoard(bombArray, shouldRevealBombs = false) {
    console.log("Board:");
    bombArray.forEach((line) => {
      let board = "";
      line.forEach((ground) => {
        if (ground.isRevealed) {
          board += "0";
        } else if (shouldRevealBombs && ground.hasBomb) {
          board += "x";
        } else {
          board += "-";
        }
      });
      console.log(board);
    });
  }

  function hasUnrevealedGroundWithoutMines(board) {
    let result = false;
    board.forEach((line) => {
      const some = line.some((ground) => !ground.isRevealed && !ground.hasBomb);
      if (some) {
        result = true;
      }
    });
    return result;
  }
  function drawBoardAndArray(board) {
    console.log(board);
    console.log(drawBoard(board));
  }

  const bombArray = constructBombArray(rows, columns);

  drawBoardAndArray(bombArray);

  while (true) {
    const canContinue = hasUnrevealedGroundWithoutMines(bombArray);
    if (!canContinue) {
      console.log("Good job you won!");
      drawBoard(bombArray, true);
      return;
    }
    const { row, column } = await getRowColumnInput(
      "Where do you want to click x,y (starting with 0)? "
    );
    const element = bombArray[row][column];
    if (element.hasBomb) {
      console.log("Boooom! you lost =\\");
      return;
    }
    bombArray[row][column] = {
      hasBomb: false,
      isRevealed: true,
    };
    console.log("Ater play:");
    drawBoardAndArray(bombArray);
  }
}

function getRowColumnInput(question) {
  const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    io.question(question, (coordinates) => {
      io.close();
      const row = coordinates[0];
      const column = coordinates[2];
      resolve({
        row: Number(row),
        column: Number(column),
      });
    })
  );
}

async function startGame() {
  console.log("Welcome to bomb miners!");
  console.log(
    `Let's see if you can reveal the entire board without getting killed ;-)`
  );
  console.log(`Instructions: 
    '-' = undiscovered ground
    '0' = cleared ground
    'x' = bomb
  `);
  const { row, column } = await getRowColumnInput(
    "How many rows and columns you would like to play with?"
  );
  play(row, column);
}

startGame();
