import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import registerSocketHandlers from "./socket/socketHandler.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

registerSocketHandlers(io);

httpServer.listen(
  process.env.PORT || 5000,
  () => {
    console.log("Server running");
  }
);