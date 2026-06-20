
export default function CommentsPanel({
  output,
  selectedRange,
  showCommentBox,
  setShowCommentBox,
  commentText,
  setCommentText,
  roomId,
  comments,
  socket,
  setHighlightedRange,
}) {
  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">
        Output
      </h3>

      <div className="h-40 overflow-auto rounded bg-slate-900 border border-slate-800 p-3 text-sm text-slate-300 whitespace-pre-wrap">
        {output || "Output will appear here"}
      </div>

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

      <div className="space-y-3">
        {comments.map((comment) => (
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

            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
