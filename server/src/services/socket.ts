// socket.ts
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'

// Créer une fonction pour initialiser Socket.IO
export function initializeSocketIO(server: http.Server): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.FRONT_END_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    })

    io.on('connection', (socket) => {
        console.log('New client connected')
        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })

    return io
}
