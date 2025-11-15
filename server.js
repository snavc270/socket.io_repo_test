import express from "express";
import http from "http";
import { Server } from "socket.io"; 

const app = express(); 
const server = http.createServer(app);
const io = new Server(server);
//tells our server to use public folder to serve our files (index.html, style.css, main.js)
app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id );

    socket.on("draw", (data) => {
        //broadcast to all other users except the one who sent the data
        socket.broadcast.emit("draw", data);
    });

    socket.on("moveRectangle", (data) => {
        socket.broadcast.emit("moveRectangle", data);
    }); 

    socket.on("clear", () => {
        socket.broadcast.emit("clear");
    }); 

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
}); 

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`);
 });

