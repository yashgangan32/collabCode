import Room from "../models/room.js";

export const getOrCreateRoom = async (roomId) => {
  let room = await Room.findOne({ roomId });

  if (!room) {
    room = await Room.create({
      roomId,
      code: "",
    });
  }

  return room;
};

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