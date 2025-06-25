import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";

const Forms = ({ uuid, socket, setUser, setUsers }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
      <div className="w-full max-w-md p-6 border border-blue-500 rounded-lg shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">Create Room</h1>
        <CreateRoomForm
        uuid={uuid}
        socket={socket}
        setUser={setUser}
        setUsers={setUsers} 
      />
      </div>

      <div className="w-full max-w-md p-6 border border-blue-500 rounded-lg shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">Join Room</h1>
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
    </div>
  );
};

export default Forms;
