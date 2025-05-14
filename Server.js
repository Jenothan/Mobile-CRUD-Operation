

const { Server } = require('socket.io');
const http = require('http');

const express =  require('express');                                                                    //import express
require('dotenv').config()                                                                              //import environment file
const mongoose = require('mongoose');                                                                   //import mongoose
const app = express();                                                                                  //creating express app
const taskRoutes = require("../Backend/Routes/taskRoute");                                              //import router from taskRoute

const Task = require('../Backend/Models/TaskModel');

const server = http.createServer(app);
const io = new Server(server, {                                                                         //create socket.io server
  cors: { origin: '*' }                                                                                 //access from all domains
});


app.use(express.json());                                                                                //to read json

app.use((req, res, next) => {                                                                           // defining middleware
    console.log('path ' + req.path + ' method ' + req.method);                                          // print request's path and method
    next();                                                                                             // next mean continue
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected successfully");




    
const changeStream = Task.watch();

    changeStream.on('change', ( ) => {     
      io.emit('taskChanged'); 
    });




    server.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((error) => console.log(error));


                                                                                                       

app.use('/tasks', taskRoutes);                                                          // taskRoutes file handle all "/tasks" path