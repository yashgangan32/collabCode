import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import { useEffect } from "react";
import { socket } from "../socket/socket";
import { runCode } from "../services/executionService";

export default function Room() {
  const { roomId } = useParams();
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(`function hello() {
  console.log("Hello World");
}`);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    alert("Room ID copied");
  };

  //USEEFFECTS
  useEffect(() => {
    socket.connect(); // 1. Manually establish connection,mounts on start means run, then after every room id change closes and runs again

    socket.emit("join-room", roomId); // 2. Tell the backend which room to join..nothing but tells server to put this connection into which room by roomid
    //room id is data, here we are using to group users by roomid(logic handle in backend) just sending roomid from frontend
    return () => {
      socket.disconnect(); // 3. Cleanup: Leave when room changes or component unmounts
    };
  }, [roomId]);

  //to handle received code by user in room
  useEffect(() => {
    const receiveCode = (incomingCode) => {
      setCode(incomingCode);
    };

    socket.on(
      "receive-code",
      receiveCode
    );

    return () => {
      socket.off(
        "receive-code",
        receiveCode
      );
    };
  }, []);


  //to load code
  useEffect(() => {
    const handleLoadCode = (savedCode) => {
      if (savedCode) {
        setCode(savedCode);
      }
    };

    socket.on("load-code", handleLoadCode);

    return () => {
      socket.off("load-code", handleLoadCode);
    };
  }, []);

  //code change handler
  const handleCodeChange = (
    newCode
  ) => {
    setCode(newCode);

    socket.emit("code-change", {
      //args passed
      roomId,
      code: newCode,
    });
  };

  //to handle connected users
  useEffect(() => {
    const handleRoomUsers = (count) => {
      setConnectedUsers(count);
    };

    socket.on(
      "room-users",
      handleRoomUsers
    );

    return () => {
      socket.off(
        "room-users",
        handleRoomUsers
      );
    };
  }, [])

  useEffect(() => {
    const handleOutput = (output) => {
      console.log(
        "RECEIVED OUTPUT:",
        output
      );

      setOutput(output);
    };

    socket.on(
      "receive-output",
      handleOutput
    );

    return () => {
      socket.off(
        "receive-output",
        handleOutput
      );
    };
  }, []);


  const handleRunCode = async () => {
    try {
      console.log("Run clicked");
      console.log(language);
      const result = await runCode(
  code,
  language
);
      setOutput(result.output);

      socket.emit("code-output", {
        roomId,
        output: result.output,
      });

      console.log(result);

      setOutput(result.output);
    } catch (error) {
      console.error(error);

      setOutput("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  }



  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">
            Collaborative Coding Platform
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            {roomId}
          </span>

          <button
            onClick={copyRoomId}
            className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700"
          >
            Copy Room ID
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
          >
            {isRunning
              ? "Running..."
              : "Run"}
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1">
          <Editor
            code={code}
            setCode={handleCodeChange}
            language={language}
          />
        </div>

        {/* Sidebar */}
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
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
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

          <div className="mt-8">
            <h3 className="font-semibold mb-2">
              Output
            </h3>

            <div className="h-40 overflow-auto rounded bg-slate-900 border border-slate-800 p-3 text-sm text-slate-300 whitespace-pre-wrap">
              {output ||
                "Output will appear here"}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}