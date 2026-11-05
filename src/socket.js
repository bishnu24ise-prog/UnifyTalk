import { io } from 'socket.io-client';

const isLocalhost = Boolean(
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
);

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (isLocalhost ? 'http://localhost:5000' : 'https://unifytalk-backend.onrender.com');

let socket;

export const connectSocket = (token) => {
  socket = io(SOCKET_URL, {
    auth: { token }
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};