const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let playersArray = [];
let playingArray = [];

io.on("connection", (socket) => {
    console.log('A user connected');

    socket.on("find game", (data) => {
        if (data.name) {
            playersArray.push({ id: socket.id, name: data.name });
            console.log(`Player ${data.name} connected`);

            if (playersArray.length >= 2) {
                let player1 = {
                    player1Name: playersArray[0].name,
                    player1Value: "X",
                    move1: ""
                };
                let player2 = {
                    player2Name: playersArray[1].name,
                    player2Value: "O",
                    move2: ""
                };

                let game = {
                    p1: player1,
                    p2: player2,
                    sum: 1
                };

                playingArray.push(game);

                const player1Socket = io.sockets.sockets.get(playersArray[0].id);
                const player2Socket = io.sockets.sockets.get(playersArray[1].id);

                player1Socket.emit("find", { allPlayers: playingArray });
                player2Socket.emit("find", { allPlayers: playingArray });

                playersArray.splice(0, 2);
            }
        }
    });

    socket.on("playing", (data) => {
        const game = playingArray.find(g => g.p1.player1Name === data.name || g.p2.player2Name === data.name);

        if (game) {
            if (data.value === "X") {
                game.p1.move1 = data.id;
            } else if (data.value === "O") {
                game.p2.move2 = data.id;
            }
            game.sum++;
            io.emit("playing", { allPlayers: playingArray });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        playersArray = playersArray.filter(player => player.id !== socket.id);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'interface.html'));
});

const PORT = 3000;
server.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
