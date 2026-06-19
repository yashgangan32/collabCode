import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const id = uuid();
    navigate(`/room/${id}`);
  };

  const joinRoom = () => {
    if (!roomId.trim()) return;

    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Collaborative Coding Platform
          </h1>

          <p className="text-slate-400 mt-4">
            Real-time coding with shared rooms
          </p>
        </div>

        <button
          onClick={createRoom}
          className="w-full py-3 rounded-t-full bg-blue-600 hover:bg-blue-500"
        >
          Create Room
        </button>

        <div className="space-y-3">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
          />

          <button
            onClick={joinRoom}
            className="w-full py-3 rounded-b-full bg-emerald-600 hover:bg-emerald-500"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}