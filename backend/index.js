const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('./config/swagger.json');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running and connected to DB!' });
});

app.use('/api/polls', require('./routes/pollRoutes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});