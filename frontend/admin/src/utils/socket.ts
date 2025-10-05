import { io, Socket } from "socket.io-client";

// Match backend events
interface ServerToClientEvents {
  attendanceRequest: (payload: { data: object; message: string }) => void;
  punchOutRequest: (payload: { data: object; message: string }) => void;
  leaveRequest: (payload: { data: object; message: string }) => void;
}

interface ClientToServerEvents {
  joinRoom: (room: string) => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3030";

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