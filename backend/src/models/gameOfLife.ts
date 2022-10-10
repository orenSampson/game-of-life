export enum cellState {
  dead,
  alive,
}

export enum gameStatus {
  stop,
  start,
}

const INIT_STATE: BoardType = [
  [
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
  ],
  [
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
  ],
  [
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
  ],
  [
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
  ],
  [
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.dead,
  ],
];

type BoardColumn = [cellState, cellState, cellState, cellState, cellState];
export type BoardType = [
  BoardColumn,
  BoardColumn,
  BoardColumn,
  BoardColumn,
  BoardColumn
];

export class GameOfLife {
  protected status: gameStatus = gameStatus.stop;
  protected numOfSteps: number = 0;
  private static instance: GameOfLife;

  private constructor(protected board: BoardType) {}

  static getInstance(boardInitialState: BoardType) {
    if (!this.instance) {
      this.instance = new GameOfLife(boardInitialState);
    }

    return this.instance;
  }
  //actions
  nextStep() {
    this.calculateNextStep();
    this.numOfSteps++;
  }

  reset() {
    if (this.status === gameStatus.stop) {
      this.numOfSteps = 0;

      this.board = [...INIT_STATE];
      for (let i = 0; i < this.board.length; i++) {
        this.board[i] = [...INIT_STATE[i]];
      }
    }
  }

  protected numOfLiveBeighborsCalc(i: number, j: number) {
    let numOfLiveNeighbors = 0;

    //upper
    if (i > 0) {
      if (j > 0) {
        numOfLiveNeighbors += this.board[i - 1][j - 1];
      }
      numOfLiveNeighbors += this.board[i - 1][j];
      if (j < this.board.length - 1) {
        numOfLiveNeighbors += this.board[i - 1][j + 1];
      }
    }

    //middle
    if (j > 0) {
      numOfLiveNeighbors += this.board[i][j - 1];
    }
    if (j < this.board.length - 1) {
      numOfLiveNeighbors += this.board[i][j + 1];
    }

    //bottom
    if (i < this.board.length - 1) {
      if (j > 0) {
        numOfLiveNeighbors += this.board[i + 1][j - 1];
      }
      numOfLiveNeighbors += this.board[i + 1][j];
      if (j < this.board.length - 1) {
        numOfLiveNeighbors += this.board[i + 1][j + 1];
      }
    }

    return numOfLiveNeighbors;
  }

  protected isCellAliveForNextStep(i: number, j: number) {
    const numOfLiveNeighbors = this.numOfLiveBeighborsCalc(i, j);

    let cellStateNextStep = cellState.dead;

    if (this.board[i][j] === cellState.alive) {
      if (numOfLiveNeighbors === 2 || numOfLiveNeighbors === 3) {
        cellStateNextStep = cellState.alive;
      }
    }

    if (this.board[i][j] === cellState.dead) {
      if (numOfLiveNeighbors === 3) {
        cellStateNextStep = cellState.alive;
      }
    }

    return cellStateNextStep;
  }

  protected calculateNextStep() {
    const nextStepBoard: BoardType = [...INIT_STATE];
    for (let i = 0; i < this.board.length; i++) {
      nextStepBoard[i] = [...INIT_STATE[i]];
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        nextStepBoard[i][j] = this.isCellAliveForNextStep(i, j);
      }
    }

    this.board = [...nextStepBoard];
  }

  printExternalBoard(someBoard: BoardType) {
    let arrText = "";

    for (let i = 0; i < someBoard.length; i++) {
      for (let j = 0; j < someBoard[i].length; j++) {
        arrText += someBoard[i][j] + " ";
      }
      console.log(arrText);
      arrText = "";
    }

    console.log("\n");
  }

  printBoard() {
    let arrText = "";

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        arrText += this.board[i][j] + " ";
      }
      console.log(arrText);
      arrText = "";
    }

    console.log("\n");
  }
}
