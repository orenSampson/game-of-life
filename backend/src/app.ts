import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import actionsRoutes from "./routes/actions";

const app = express();

app.use(json());

app.use("/api", actionsRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(8080);
