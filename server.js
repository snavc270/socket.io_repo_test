import express from "express";
import http from "http";
import { Server } from "socket.io"; 

const PORT = 3000; 

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

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

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
