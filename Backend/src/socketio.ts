import { Server } from "socket.io";
import { Server as HttpServer } from "http";

interface ServerToClientEvents {
  attendanceRequest: (payload: { data: any; message: string }) => void;
  punchOutRequest: (payload: { data: any; message: string }) => void;
  leaveRequest: (payload: { data: any; message: string }) => void;
  attendanceUpdated: (payload: { data: any; message: string }) => void;
  leaveUpdated: (payload: { data: any; message: string }) => void;
  punchOutUpdated: (payload: { data: any; message: string }) => void;
}

interface ClientToServerEvents {
  joinRoom: (room: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents
  >(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // staff or manager joins a room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
    });
  });

  return io;
};

export const emitAttendanceRequest = (attendance: any) => {
  const branchRoom = `branch:${attendance.branch}:managers`;
  io.to(branchRoom).emit("attendanceRequest", {
    data: attendance,
    message: "New attendance request submitted",
  });
};

export const emitLeaveRequest = (leave: any) => {
  const branchRoom = `branch:${leave.branch}:managers`;
  io.to(branchRoom).emit("leaveRequest", {
    data: leave,
    message: "New leave request submitted",
  });
};

export const emitPunchOutRequest = (attendance: any) => {
  const branchRoom = `branch:${attendance.branch}:managers`;
  io.to(branchRoom).emit("punchOutRequest", {
    data: attendance,
    message: "New punch-out request submitted",
  });
};

export const emitAttendanceUpdated = (attendance: any) => {
  const userRoom = `branch:${attendance.branch}:staffs:${attendance.staffId}`;
  io.to(userRoom).emit("attendanceUpdated", {
    data: attendance.status,
    message: "Your attendance was updated by manager",
  });
};

export const emitLeaveUpdated = (leave: any) => {
  const userRoom = `branch:${leave.branch}:staffs:${leave.staffId}`;
  io.to(userRoom).emit("leaveUpdated", {
    data: leave.status,
    message: "Your leave request was updated by manager",
  });
};

export const emitPunchOutUpdated = (attendance: any) => {
  const userRoom = `branch:${attendance.branch}:staffs:${attendance.staffId}`;
  io.to(userRoom).emit("punchOutUpdated", {
    data: attendance.punchOut.status,
    message: "Your punch-out request was updated by manager",
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
