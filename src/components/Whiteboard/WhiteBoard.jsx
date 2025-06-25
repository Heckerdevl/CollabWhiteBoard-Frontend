import { useEffect, useState, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import jsPDF from "jspdf";

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  user,
  socket
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const history = useRef([]);
  const isLocalChange = useRef(false);

  // Setup canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(scale, scale);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  // Redraw canvas and emit only local changes
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const roughCanvas = rough.canvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((el) => {
      const { offsetX, offsetY, width, height, stroke } = el;
      if (el.type === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(offsetX, offsetY, width, height, {
            stroke,
            strokeWidth: 2,
            roughness: 0
          })
        );
      } else if (el.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(offsetX, offsetY, width, height, {
            stroke,
            strokeWidth: 2,
            roughness: 0
          })
        );
      } else if (el.type === "pencil") {
        roughCanvas.linearPath(el.path, {
          stroke,
          strokeWidth: 2,
          roughness: 0
        });
      }
    });

    if (isLocalChange.current) {
      isLocalChange.current = false;

      const normElements = elements.map((el) => {
        const norm = {
          ...el,
          offsetX: el.offsetX / canvas.width,
          offsetY: el.offsetY / canvas.height,
          width: el.width / canvas.width,
          height: el.height / canvas.height
        };
        if (el.type === "pencil") {
          norm.path = el.path.map(([x, y]) => [
            x / canvas.width,
            y / canvas.height
          ]);
        }
        return norm;
      });

      socket.emit("whiteboardData", { elements: normElements });
    }
  }, [elements]);

  // Receive whiteboard updates from other users
  useEffect(() => {
    const handleWhiteboardData = (data) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const denormElements = data.elements.map((el) => {
        const denorm = {
          ...el,
          offsetX: el.offsetX * canvas.width,
          offsetY: el.offsetY * canvas.height,
          width: el.width * canvas.width,
          height: el.height * canvas.height
        };
        if (el.type === "pencil") {
          denorm.path = el.path.map(([x, y]) => [
            x * canvas.width,
            y * canvas.height
          ]);
        }
        return denorm;
      });

      setElements(denormElements);
      history.current = [...history.current, denormElements];
    };

    socket.on("whiteboardDataResponse", handleWhiteboardData);
    return () => socket.off("whiteboardDataResponse", handleWhiteboardData);
  }, [socket, setElements]);

  const handleMouseDown = (e) => {
    if (!user?.presenter) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const base = { offsetX, offsetY, stroke: color };

    let newElement;
    if (tool === "pencil") {
      newElement = { ...base, type: "pencil", path: [[offsetX, offsetY]] };
    } else if (tool === "line") {
      newElement = { ...base, type: "line", width: offsetX, height: offsetY };
    } else if (tool === "rect") {
      newElement = { ...base, type: "rect", width: 0, height: 0 };
    }

    isLocalChange.current = true;
    setElements((prev) => [...prev, newElement]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !user?.presenter) return;

    const { offsetX, offsetY } = e.nativeEvent;

    isLocalChange.current = true;
    setElements((prev) =>
      prev.map((el, idx) => {
        if (idx !== prev.length - 1) return el;

        if (tool === "pencil") {
          return { ...el, path: [...el.path, [offsetX, offsetY]] };
        } else if (tool === "line") {
          return { ...el, width: offsetX, height: offsetY };
        } else if (tool === "rect") {
          return {
            ...el,
            width: offsetX - el.offsetX,
            height: offsetY - el.offsetY
          };
        }

        return el;
      })
    );
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      history.current = [...history.current, elements];
    }
    setIsDrawing(false);
  };

  const handleExport = (format = "png") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    if (format === "png") {
      const link = document.createElement("a");
      link.download = "whiteboard.png";
      link.href = dataURL;
      link.click();
    } else if (format === "pdf") {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(dataURL, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("whiteboard.pdf");
    }
  };

  const handleUndo = () => {
    if (history.current.length < 2) return;
    const newHistory = [...history.current];
    newHistory.pop();
    const last = newHistory[newHistory.length - 1];
    history.current = newHistory;
    isLocalChange.current = true;
    setElements(last);
  };

  const handleClear = () => {
    history.current = [[]];
    isLocalChange.current = true;
    setElements([]);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-screen overflow-hidden border border-gray-800"
    >
      {/* Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Undo
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Clear
        </button>
      </div>

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => handleExport("png")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Export PNG
        </button>
        <button
          onClick={() => handleExport("pdf")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export PDF
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default WhiteBoard;
