const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')

app.use(express.static(publicDir))

const message = 'Welcome!'

io.on('connection', (socket) => {
    console.log('New Web Socket Connection')

    socket.emit('message', message)
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (msg, cb) => {
        const filter = new Filter()

if (filter.isProfane(msg)) {
    return cb('Profanity banned')
}

        io.emit('message', msg)
        cb()
    })

    socket.on('sendLocation', (location, cb) => {
        io.emit('message', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`)
        cb()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'a user has left')
    })
})

server.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
})