import { useState } from "react";
export default function CommentsPanel({
  selectedRange,
  showCommentBox,
  setShowCommentBox,
  commentText,
  setCommentText,
  roomId,
  comments,
  socket,
  setHighlightedRange,
  filter,
  setFilter
}) {

  const [replyText, setReplyText] = useState("");
  const [activeReplyComment, setActiveReplyComment] = useState(null);

  const openCount =
    comments.filter(
      (comment) =>
        comment.status === "open"
    ).length;

  const resolvedCount =
    comments.filter(
      (comment) =>
        comment.status ===
        "resolved"
    ).length;

  const filteredComments =
    comments.filter(
      (comment) => {
        if (
          filter === "all"
        ) {
          return true;
        }

        return (
          comment.status ===
          filter
        );
      }
    );


  return (
    <div className="mt-8">

      {selectedRange && (
        <button
          onClick={() =>
            setShowCommentBox(true)
          }
          className="mt-3 mb-3 px-3 py-2 rounded bg-blue-600"
        >
          Add Comment
        </button>
      )}

      {showCommentBox && (
        <div className="mb-4 rounded border border-slate-700 p-3">
          <p className="mb-2 text-sm">
            Selected Lines:
            {" "}
            {selectedRange.startLine}-
            {selectedRange.endLine}
          </p>

          <textarea
            value={commentText}
            onChange={(e) =>
              setCommentText(
                e.target.value
              )
            }
            placeholder="Enter comment..."
            className="w-full rounded bg-slate-900 border border-slate-700 p-2"
            rows={4}
          />

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                setCommentText("");
                setShowCommentBox(false);
              }}
              className="px-3 py-2 rounded bg-slate-700"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                socket.emit(
                  "add-comment",
                  {
                    roomId,
                    startLine:
                      selectedRange.startLine,
                    endLine:
                      selectedRange.endLine,
                    text: commentText,
                  }
                );

                setCommentText("");
                setShowCommentBox(false);
              }}
              className="px-3 py-2 rounded bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() =>
            setFilter("all")
          }
          className={`px-2 py-1 rounded ${filter === "all"
            ? "bg-blue-600"
            : "bg-slate-700"
            }`}
        >
          All ({comments.length})
        </button>

        <button
          onClick={() =>
            setFilter("open")
          }
          className={`px-2 py-1 rounded ${filter === "open"
            ? "bg-blue-600"
            : "bg-slate-700"
            }`}
        >
          Open ({openCount})
        </button>

        <button
          onClick={() =>
            setFilter("resolved")
          }
          className={`px-2 py-1 rounded ${filter === "resolved"
            ? "bg-blue-600"
            : "bg-slate-700"
            }`}
        >
          Resolved ({resolvedCount})
        </button>
      </div>
      <div className="space-y-3">
        {
          filteredComments.map((comment) => (
            <div
              key={comment._id}
              onClick={() =>
                setHighlightedRange({
                  startLine:
                    comment.startLine,
                  endLine:
                    comment.endLine,
                })
              }
              className="cursor-pointer rounded border border-slate-800 p-2 hover:bg-slate-900"
            >
              <p className="text-xs text-slate-400">
                Lines {comment.startLine}-
                {comment.endLine}
              </p>

              <div className="flex items-center justify-between mb-2">
                <p>Status:</p>
                <span>
                  {comment.status ===
                    "resolved"
                    ? "🟢 Resolved"
                    : "🟡 Open"}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    socket.emit(
                      "comment-status-change",
                      {
                        commentId:
                          comment._id,

                        status:
                          comment.status ===
                            "open"
                            ? "resolved"
                            : "open",
                      }
                    );
                  }}
                  className="text-xs px-2 py-1 rounded bg-slate-700"
                >
                  {comment.status ===
                    "open"
                    ? "Resolve"
                    : "Reopen"}
                </button>
              </div>

              <p>{comment.text}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setActiveReplyComment(
                    comment._id
                  );
                }}
                className="mt-2 text-sm text-blue-400"
              >
                Reply
              </button>
              {activeReplyComment ===
                comment._id && (
                  <div className="mt-2">
                    <textarea
                      value={replyText}
                      onChange={(e) =>
                        setReplyText(
                          e.target.value
                        )
                      }
                      rows={2}
                      placeholder="Write reply..."
                      className="w-full rounded bg-slate-900 border border-slate-700 p-2"
                    />

                    <button
                      onClick={() => {
                        socket.emit(
                          "add-reply",
                          {
                            commentId:
                              comment._id,

                            text: replyText,
                          }
                        );

                        setReplyText("");
                        setActiveReplyComment(
                          null
                        );
                      }}
                      className="mt-2 px-2 py-1 rounded bg-green-600"
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              {comment.replies?.map(
                (reply, index) => (
                  <div
                    key={index}
                    className="ml-4 mt-2 border-l border-slate-700 pl-3 text-sm"
                  >
                    {reply.text}
                  </div>
                )
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
