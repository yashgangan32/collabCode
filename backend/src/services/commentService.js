import Comment from "../models/Comment.js";

export const createComment =
  async ({
    roomId,
    startLine,
    endLine,
    text,
  }) => {
    return Comment.create({
      roomId,
      startLine,
      endLine,
      text,
    });
  };

export const getRoomComments =
  async (roomId) => {
    return Comment.find({
      roomId,
    }).sort({
      createdAt: 1,
    });
  };
 
  export const updateCommentStatus =
  async (
    commentId,
    status
  ) => {
    return Comment.findByIdAndUpdate(
      commentId,
      { status },
      {
        returnDocument: "after",
      }
    );
  };