
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Editor from "../components/Editor";
import RoomHeader from "../components/RoomHeader";
import RoomSidebar from "../components/RoomSidebar";

import { socket } from "../socket/socket";
import { runCode } from "../services/executionService";

export default function Room() {
  const { roomId } = useParams();
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`console.log("Hello World")`);
  const [selectedRange, setSelectedRange] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [highlightedRange, setHighlightedRange] = useState(null);
  const [filter, setFilter] = useState("all");
  const copyRoomId = async () => {
    await navigator.clipboard.writeText(
      roomId
    );

    alert("Room ID copied");
  };

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

  useEffect(() => {
    const receiveCode = (
      incomingCode
    ) => {
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

  const handleCodeChange = (
    newCode
  ) => {
    setCode(newCode);

    socket.emit(
      "code-change",
      {
        roomId,
        code: newCode,
      }
    );
  };

  useEffect(() => {
    const handleRoomUsers =
      (count) => {
        setConnectedUsers(
          count
        );
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
  }, []);

  useEffect(() => {
    const handleOutput =
      (output) => {
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

  const handleRunCode =
    async () => {
      try {
        setIsRunning(true);

        const result =
          await runCode(
            code,
            language
          );

        setOutput(
          result.output
        );

        socket.emit(
          "code-output",
          {
            roomId,
            output:
              result.output,
          }
        );
      } catch (error) {
        setOutput(
          "Failed to execute code"
        );
      } finally {
        setIsRunning(false);
      }
    };

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

  useEffect(() => {
    const handleLoadComments =
      (comments) => {
        setComments(
          comments
        );
      };

    socket.on(
      "load-comments",
      handleLoadComments
    );

    return () => {
      socket.off(
        "load-comments",
        handleLoadComments
      );
    };
  }, []);

  useEffect(() => {
    const handleReceiveComment =
      (comment) => {
        setComments(
          (prev) => [
            ...prev,
            comment,
          ]
        );
      };

    socket.on(
      "receive-comment",
      handleReceiveComment
    );

    return () => {
      socket.off(
        "receive-comment",
        handleReceiveComment
      );
    };
  }, []);


  useEffect(() => {
    const handleStatusUpdate =
      (updatedComment) => {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id ===
              updatedComment._id
              ? updatedComment
              : comment
          )
        );
      };

    socket.on(
      "comment-status-updated",
      handleStatusUpdate
    );

    return () => {
      socket.off(
        "comment-status-updated",
        handleStatusUpdate
      );
    };
  }, []);

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <RoomHeader
        roomId={roomId}
        isRunning={isRunning}
        onCopy={copyRoomId}
        onRun={handleRunCode}
      />

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="h-[65%]">
            <Editor
              code={code}
              setCode={handleCodeChange}
              language={language}
              setSelectedRange={
                setSelectedRange
              }
              highlightedRange={
                highlightedRange
              }
            />
          </div>

          <div className="h-[35%] border-t border-slate-800 p-4">
            <h3 className="font-semibold mb-2">
              Output
            </h3>

            <div className="h-full overflow-auto rounded bg-slate-900 border border-slate-800 p-3 text-sm text-slate-300 whitespace-pre-wrap">
              {output ||
                "Output will appear here"}
            </div>
          </div>
        </div>

        <RoomSidebar
          filter={filter}
          setFilter={setFilter}
          connectedUsers={
            connectedUsers
          }
          language={language}
          setLanguage={
            setLanguage
          }
          roomId={roomId}
          socket={socket}
          output={output}
          selectedRange={
            selectedRange
          }
          showCommentBox={
            showCommentBox
          }
          setShowCommentBox={
            setShowCommentBox
          }
          commentText={commentText}
          setCommentText={
            setCommentText
          }
          comments={comments}
          setHighlightedRange={
            setHighlightedRange
          }
        />
      </div>
    </div>
  );
}
