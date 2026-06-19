import {
  getOrCreateRoom,
  updateRoomCode,
} from "../services/roomService.js";

const registerSocketHandlers = (io) => {
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

      const roomSize =
        io.sockets.adapter.rooms.get(roomId)
          ?.size || 0;

      io.to(roomId).emit(
        "room-users",
        roomSize
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
    socket.on(
      "code-output",
      ({ roomId, output }) => {
        console.log(
          "OUTPUT EVENT:",
          roomId,
          output
        );
        io.to(roomId).emit(
          "receive-output",
          output
        );
      }
    );

    socket.on("disconnecting", () => {
      socket.rooms.forEach((roomId) => {
        if (roomId === socket.id) return;

        const roomSize =
          (io.sockets.adapter.rooms.get(
            roomId
          )?.size || 1) - 1;

        io.to(roomId).emit(
          "room-users",
          Math.max(roomSize, 0)
        );
      });
    });

    socket.on("disconnect", () => {
      console.log(
        "Disconnected:",
        socket.id
      );
    });
  });
};

export default registerSocketHandlers;