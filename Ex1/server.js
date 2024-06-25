const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const eventRoutes = require('./routes/events');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
// Подключаем маршрутыЫ
// Изменение пути подключения маршрутов с '/events' на '/meetups'
app.use('/meetups', eventRoutes);
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: true,
}));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});