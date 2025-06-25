import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({ uuid, socket, setUser, setUsers }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!name) return;

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    setUsers([]);
    socket.emit("userJoined", roomData);
    navigate(`/${roomId}`);
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() =>
      console.log("Room ID copied")
    );
  };

  return (
    <form className="max-w-md w-full mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-blue-700 text-center mb-4">Create Room</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
      />
      <div className="flex items-center gap-2 border border-gray-300 p-2 rounded mb-4">
        <input
          type="text"
          value={roomId}
          disabled
          className="flex-grow px-4 py-2 bg-gray-100 rounded"
        />
        <button
          type="button"
          onClick={() => setRoomId(uuid())}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
        >
          Generate
        </button>
        <div >

        <button
          type="button"
          onClick={copyRoomIdToClipboard}
          className="px-1  py-1 text-sm text-red-600 border border-red-600 rounded"
          >
          Copy
        </button>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleCreateRoom}
        className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
