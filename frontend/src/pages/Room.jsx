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
  const [code, setCode] = useState(`console.log("Hello World")`);
  const [selectedRange,setSelectedRange] = useState(null);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    alert("Room ID copied");
  };

  //to handle required things when join
useEffect(() => {
  socket.connect();

  socket.emit(
    "join-room",
    roomId
  );

  const handleConnect = () => {
    socket.emit(
      "join-room",
      roomId
    );
  };

  socket.on(
    "connect",
    handleConnect
  );

  return () => {
    socket.off(
      "connect",
      handleConnect
    );
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
    const handleLoadRoom = (
      roomData
    ) => {
      setCode(
        roomData.code || ""
      );

      setLanguage(
        roomData.language ||
        "javascript"
      );

      setOutput(
        roomData.lastOutput ||
        ""
      );
    };

    socket.on(
      "load-room",
      handleLoadRoom
    );

    return () => {
      socket.off(
        "load-room",
        handleLoadRoom
      );
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

  //handling sync of output
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


  //handling executaion of code and syncing
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


  //handling language syncing
  useEffect(() => {
    const handleLanguage =
      (language) => {
        setLanguage(
          language
        );
      };

    socket.on(
      "receive-language",
      handleLanguage
    );

    return () => {
      socket.off(
        "receive-language",
        handleLanguage
      );
    };
  }, []);


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
            setSelectedRange={
              setSelectedRange
            }
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

          <div className="mt-8">
            {selectedRange && (
  <button
    className="mb-3 px-3 py-2 rounded bg-blue-600"
  >
    Add Comment
  </button>
)}

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