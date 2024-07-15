const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const routes = require('./routes');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use((req, res, next) => {
  req.supabase = supabase;
  req.io = io;
  next();
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error: ' + err.message);
});

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('ai_result', (result) => {
    io.emit(`ai_result_${result.task_id}`, result);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));