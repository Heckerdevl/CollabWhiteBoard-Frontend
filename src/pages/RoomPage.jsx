import React, { useEffect, useRef, useState } from "react";
import WhiteBoard from "../components/Whiteboard/WhiteBoard";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000"); 
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);

  useEffect(() => {
    return () => {
      socket.emit("userLeft", user);
    };
  }, []);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    setHistory([]);
  };

  const undo = () => {
    if (elements.length === 0) return;
    const last = elements[elements.length - 1];
    setHistory((prev) => [...prev, last]);
    setElements((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setElements((prev) => [...prev, last]);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* User Side Panel */}
      <button
        type="button"
        onClick={() => setOpenedUserTab(true)}
        className="absolute top-5 left-5 px-4 py-2 bg-gray-800 text-white rounded"
      >
        Users
      </button>

      {openedUserTab && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-5 z-10 shadow-lg">
          <button
            type="button"
            onClick={() => setOpenedUserTab(false)}
            className="w-full mb-4 py-2 bg-gray-100 text-gray-900 rounded"
          >
            Close
          </button>
          <h3 className="text-lg font-bold mb-2">Users in Room</h3>
          <div className="space-y-2">
            {users.map((usr, i) => (
              <p key={i} className="text-center">
                {usr.name} {user?.userId === usr.userId && "(You)"}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Page Title */}
      <h1 className="text-center text-2xl font-bold text-blue-700 py-4">
        Whiteboard Sharing App{" "}
        <span className="text-sm text-gray-700">[Users Online: {users.length}]</span>
      </h1>

      {/* Tools Section */}
      {user?.presenter && (
        <div className="flex flex-wrap justify-center items-center gap-4 px-6 mb-4">
          {/* Tool Selector */}
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tool"
                value="pencil"
                checked={tool === "pencil"}
                onChange={(e) => setTool(e.target.value)}
              />
              Pencil
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tool"
                value="line"
                checked={tool === "line"}
                onChange={(e) => setTool(e.target.value)}
              />
              Line
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tool"
                value="rect"
                checked={tool === "rect"}
                onChange={(e) => setTool(e.target.value)}
              />
              Rectangle
            </label>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <label htmlFor="color">Color:</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 border rounded"
            />
          </div>

          {/* Undo / Redo / Clear */}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={elements.length === 0}
              onClick={undo}
            >
              Undo
            </button>
            <button
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded disabled:opacity-50"
              disabled={history.length === 0}
              onClick={redo}
            >
              Redo
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleClearCanvas}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="mx-auto max-w-screen-xl mt-2 h-[calc(100vh-200px)] px-4">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
          user={user}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default RoomPage;
