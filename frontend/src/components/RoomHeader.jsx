export default function RoomHeader({
  roomId,
  isRunning,
  onCopy,
  onRun,
}) {
  return (
    <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between">
      <div>
        <h1 className="font-bold text-lg">
          Collaborative Coding Platform
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">{roomId}</span>

        <button
          onClick={onCopy}
          className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700"
        >
          Copy Room ID
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>
    </header>
  );
}
