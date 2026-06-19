import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import {
  getOrCreateRoom,
  updateRoomCode,
} from "./services/roomService.js";

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

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-room", async (roomId) => {
    socket.join(roomId);

    const room = await getOrCreateRoom(
      roomId
    );

    socket.emit(
      "load-code",
      room.code
    );

    console.log(
      `${socket.id} joined ${roomId}`
    );
  });

  socket.on(
    "code-change",
    async ({ roomId, code }) => {
      await updateRoomCode(
        roomId,
        code
      );

      socket
        .to(roomId)
        .emit(
          "receive-code",
          code
        );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "Disconnected:",
      socket.id
    );
  });
});

httpServer.listen(
  process.env.PORT || 5000,
  () => {
    console.log(
      "Server running"
    );
  }
);