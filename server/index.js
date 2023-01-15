//module import
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const Room = require("./models/room");

var io = require("socket.io")(server);

//middleware
app.use(express.json());

const DB = "mongodb+srv://hydrohomie:willbesmashing@cluster0.yby1ren.mongodb.net/?retryWrites=true&w=majority";

io.on("connection", (socket) => {
    console.log("connected!");
    socket.on("createRoom", async ({ nickname }) => {
        console.log(nickname);
        try {
            //room created 
            let room = new Room();
            let player = {
                socketID: socket.id,
                nickname,
                playerType: 'X',
            };
            room.players.push(player);
            room.turn = player;
            room = await room.save();
            console.log(room);
            const roomId = room._id.toString();

            socket.join(roomId);
            // io -> send data to everyone
            // socket -> sending data to yourself

            io.to(roomId).emit('createRoomSuccess', room);
        } catch(e) {
            console.log(e);
        }
    });

    socket.on('joinRoom', async ({nickname, roomId}) => {
        try {
            if(!roomId.match(/^[0-9a-fA-F]{24}$/)) {
                socket.emit('errorOccurred', 'Please enter a valid room ID.');
                return;
            }
            let room = await Room.findById(roomId);
            console.log('finding room');
            console.log(room);
            if (room.isJoin) {
                console.log('Joining the room');
                let player = {
                    nickname,
                    socketID: socket.id,
                    playerType: 'O',
                };
                socket.join(roomId);
                room.players.push(player);
                room.isJoin = false;
                room = await room.save();
                io.to(roomId).emit('joinRoomSuccess', room);
                io.to(roomId).emit('updatePlayers', room.players);
            } else {
                socket.emit('errorOccurred', 'The game is in progress, try again later.');
            }
            console.log('after the join try-catch');
        } catch (e) {
            console.log(e);
        }
    })
});

mongoose
    .connect(DB)
    .then(() => {
        console.log('Connection successful');
    })
    .catch((e) => {
        console.log(e);
    })

server.listen(port, '0.0.0.0', () => {
    console.log(`Server has started and is running on port ${port}`);
});

