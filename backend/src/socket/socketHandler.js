import {
  getOrCreateRoom,
  updateRoomCode,
  updateRoomOutput,
  updateRoomLanguage
} from "../services/roomService.js";
import {
  createComment,
  getRoomComments,
} from "../services/commentService.js";

const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    //handling when any user joins
    socket.on("join-room", async (roomId) => {
      socket.join(roomId);

      const room = await getOrCreateRoom(
        roomId
      );
      const comments =
        await getRoomComments(
          roomId
        );

      socket.emit(
        "load-room",
        {
          code: room.code,
          language: room.language,
          lastOutput: room.lastOutput,
        }
      );
      socket.emit(
        "load-comments",
        comments
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
    "add-comment",
    async (commentData) => {
      const comment =
        await createComment(
          commentData
        );

      io.to(
        comment.roomId
      ).emit(
        "receive-comment",
        comment
      );
    }
  );

    //syncing room code
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
      "language-change",
      async ({
        roomId,
        language,
      }) => {
        await updateRoomLanguage(
          roomId,
          language
        );

        socket
          .to(roomId)
          .emit(
            "receive-language",
            language
          );
      }
    );


    //syncing code output
    socket.on(
      "code-output",
      async ({ roomId, output }) => {
        await updateRoomOutput(
          roomId,
          output
        );

        io.to(roomId).emit(
          "receive-output",
          output
        );
      }
    );

    //handling while disconnecting
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