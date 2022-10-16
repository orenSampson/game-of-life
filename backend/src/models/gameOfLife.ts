export enum cellState {
  dead,
  alive,
}

type Tuple<T, N extends number, A extends any[] = []> = A extends { length: N }
  ? A
  : Tuple<T, N, [...A, T]>;
const BOARD_SIZE = 5;
export type Board = Tuple<
  Tuple<cellState, typeof BOARD_SIZE>,
  typeof BOARD_SIZE
>;

export enum gameStatus {
  stop,
  start,
}

export class GameOfLife {
  protected board: Board = GameOfLife.returnInitState();
  protected status = gameStatus.stop;
  protected numOfSteps = 0;
  protected intevalID: NodeJS.Timer | undefined;
  private static instance: GameOfLife;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new GameOfLife();
    }

    return this.instance;
  }
  //actions
  initBoardAction(initialBoard: Board) {
    this.board = initialBoard;
  }

  nextStepAction() {
    if (this.status === gameStatus.stop) {
      this.nextStep();
    }
  }

  resetAction() {
    if (this.status === gameStatus.stop) {
      this.board = GameOfLife.returnInitState();
      this.numOfSteps = 0;
      this.intevalID = undefined;
    }
  }

  startAction() {
    const that = this;

    if (this.status === gameStatus.stop && this.isLifeLeftOnBoard()) {
      this.status = gameStatus.start;

      this.intevalID = setInterval(function () {
        that.nextStep();
      }, 2000);
    }
  }

  stopAction() {
    if (this.status === gameStatus.start) {
      this.status = gameStatus.stop;

      clearInterval(this.intevalID);

      this.intevalID = undefined;
    }
  }

  //auxiliary functions
  protected static returnInitState() {
    const initState: any[][] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      initState.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        initState[i].push(cellState.dead);
      }
    }

    return initState as Board;
  }

  protected nextStep() {
    if (this.isLifeLeftOnBoard()) {
      this.calculateNextStep();
      this.numOfSteps++;
    }
  }

  protected isLifeLeftOnBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (this.board[i][j] === cellState.alive) {
          return true;
        }
      }
    }

    return false;
  }

  protected calculateNextStep() {
    const nextStepBoard: Board = GameOfLife.returnInitState();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        nextStepBoard[i][j] = this.cellStateAtNextStep(i, j);
      }
    }

    if (GameOfLife.areEqualBoards(this.board, nextStepBoard)) {
      this.stopAction();
    }

    this.board = nextStepBoard;
  }

  protected cellStateAtNextStep(i: number, j: number) {
    const numOfLiveNeighbors = this.numOfLiveBeighborsCalc(i, j);

    if (this.board[i][j] === cellState.alive) {
      if (numOfLiveNeighbors === 2 || numOfLiveNeighbors === 3) {
        return cellState.alive;
      }
    }

    if (this.board[i][j] === cellState.dead) {
      if (numOfLiveNeighbors === 3) {
        return cellState.alive;
      }
    }

    return cellState.dead;
  }

  protected numOfLiveBeighborsCalc(i: number, j: number) {
    let numOfLiveNeighbors = 0;

    //upper
    if (i > 0) {
      if (j > 0) {
        numOfLiveNeighbors += this.board[i - 1][j - 1];
      }
      numOfLiveNeighbors += this.board[i - 1][j];
      if (j < BOARD_SIZE - 1) {
        numOfLiveNeighbors += this.board[i - 1][j + 1];
      }
    }

    //middle
    if (j > 0) {
      numOfLiveNeighbors += this.board[i][j - 1];
    }
    if (j < BOARD_SIZE - 1) {
      numOfLiveNeighbors += this.board[i][j + 1];
    }

    //bottom
    if (i < BOARD_SIZE - 1) {
      if (j > 0) {
        numOfLiveNeighbors += this.board[i + 1][j - 1];
      }
      numOfLiveNeighbors += this.board[i + 1][j];
      if (j < BOARD_SIZE - 1) {
        numOfLiveNeighbors += this.board[i + 1][j + 1];
      }
    }

    return numOfLiveNeighbors;
  }

  protected static areEqualBoards(board1: Board, board2: Board) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
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

// export const printExternalBoard = (someBoard: Board) => {
//   let arrText = "";

//   for (let i = 0; i < someBoard.length; i++) {
//     for (let j = 0; j < someBoard[i].length; j++) {
//       arrText += someBoard[i][j] + " ";
//     }
//     console.log(arrText);
//     arrText = "";
//   }

//   console.log("\n");
// };
