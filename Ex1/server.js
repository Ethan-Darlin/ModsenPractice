// app.js
const bodyParser = require('body-parser');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const eventRoutes = require('./routes/events');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
// Подключаем маршруты
app.use('/events', eventRoutes);

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});