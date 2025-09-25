import { io, Socket } from "socket.io-client";

// Match backend events
interface ServerToClientEvents {
  attendanceUpdated: (payload: { data: any; message: string }) => void;
  leaveUpdated: (payload: { data: any; message: string }) => void;
  punchOutUpdated: (payload: { data: any; message: string }) => void;
  
}

interface ClientToServerEvents {
  joinRoom: (room: string) => void;
}

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3030";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};