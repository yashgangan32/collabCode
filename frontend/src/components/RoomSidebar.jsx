
import CommentsPanel from "./CommentsPanel";

export default function RoomSidebar({
  connectedUsers,
  language,
  setLanguage,
  roomId,
  socket,
  selectedRange,
  showCommentBox,
  setShowCommentBox,
  commentText,
  setCommentText,
  comments,
  setHighlightedRange,
  filter,
  setFilter
}) {
  return (
    <aside className="w-72 border-l border-slate-800 p-4">
      <h2 className="font-semibold mb-4">
        Room Info
      </h2>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-slate-500">
            Connected Users
          </p>

          <p>{connectedUsers}</p>
        </div>

        <div>
          <p className="text-slate-500">
            Language
          </p>

          <select
            value={language}
            onChange={(e) => {
              const newLanguage =
                e.target.value;

              setLanguage(
                newLanguage
              );

              socket.emit(
                "language-change",
                {
                  roomId,
                  language:
                    newLanguage,
                }
              );
            }}
            className="w-full mt-2 bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            <option value="javascript">
              JavaScript
            </option>

            <option value="python">
              Python
            </option>

            <option value="cpp">
              C++
            </option>
          </select>
        </div>
      </div>

      <CommentsPanel
        selectedRange={selectedRange}
        showCommentBox={showCommentBox}
        setShowCommentBox={
          setShowCommentBox
        }
        commentText={commentText}
        setCommentText={
          setCommentText
        }
        roomId={roomId}
        comments={comments}
        socket={socket}
        setHighlightedRange={
          setHighlightedRange
        }
        filter={filter}
        setFilter={setFilter}
      />
    </aside>
  );
}
