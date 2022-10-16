import express, { Request, Response, NextFunction } from "express";
import { Socket, Server } from "socket.io";
// import { json } from "body-parser";

import actionsRoutes from "./routes/actions";
import { GameOfLife, cellState } from "./models/gameOfLife";

const app = express();

// app.use(json());

const gameOfLifeInstance = GameOfLife.getInstance();

gameOfLifeInstance.initBoardAction([
  [
    cellState.dead,
    cellState.dead,
    cellState.alive,
    cellState.dead,
    cellState.dead,
  ],
  [
    cellState.dead,
    cellState.dead,
    cellState.dead,
    cellState.alive,
    cellState.dead,
  ],
  [
    cellState.dead,
    cellState.alive,
    cellState.alive,
    cellState.alive,
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
]);

// gameOfLifeInstance.startAction();

// gameOfLifeInstance.printBoard();

// gameOfLifeInstance.nextStepAction();

// gameOfLifeInstance.printBoard();

// gameOfLifeInstance.nextStepAction();

// gameOfLifeInstance.printBoard();

// gameOfLifeInstance.resetAction();

// gameOfLifeInstance.printBoard();

// app.use("/api", actionsRoutes);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).json({ message: err.message });
// });

const server = app.listen(8080);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const startListeners = (socket: Socket) => {
  socket.on("init", (data) => {
    console.log("init called");
    console.log("data :>> ", data);
  });

  console.log("Client connected");
};

io.on("connection", startListeners);
