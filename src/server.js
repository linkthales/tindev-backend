const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const port = 3333;
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://lulu:705648@cluster0-86nqd.mongodb.net/tindev?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(express.json());
app.use(cors());
app.use(routes);

server.listen(port);