import { io } from 'socket.io-client'

export const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
})
