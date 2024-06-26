const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const eventRoutes = require('./routes/events');
const swaggerSetup = require('./swagger');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/meetups', eventRoutes);
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});