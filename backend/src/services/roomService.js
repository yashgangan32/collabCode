import Room from "../models/room.js";

// create room if not there
export const getOrCreateRoom = async (
  roomId
) => {
  let room = await Room.findOne({
    roomId,
  });

  if (!room) {
    room = await Room.create({
      roomId,
      code: "",
      language: "javascript",
      lastOutput: "",
    });
  }

  return room;
};

// update code
export const updateRoomCode = async (
  roomId,
  code
) => {
  return Room.findOneAndUpdate(
    { roomId },
    { code },
    {
      returnDocument: "after",
      upsert: true,
    }
  );
};

// update language
export const updateRoomLanguage =
  async (roomId, language) => {
    return Room.findOneAndUpdate(
      { roomId },
      { language },
      {
        returnDocument: "after",
        upsert: true,
      }
    );
  };

// update output
export const updateRoomOutput =
  async (roomId, lastOutput) => {
    return Room.findOneAndUpdate(
      { roomId },
      { lastOutput },
      {
        returnDocument: "after",
        upsert: true,
      }
    );
  };