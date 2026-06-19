import mongoose from "mongoose";

const schema=new mongoose.Schema({
     roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Room = mongoose.model("Room", schema);

export default Room;