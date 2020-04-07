require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('./auth/passport');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const fellowsRouter = require('./routes/fellows');
const volunteerRouter = require('./routes/volunteers');
const timeRouter = require('./routes/time');
const eventsRouter = require('./routes/events');

const { checkUserLogged } = require('./auth/helpers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth', authRouter);
app.use('/api/users', checkUserLogged, usersRouter);
app.use('/api/fellows', /*checkUserLogged,*/ fellowsRouter);
app.use('/api/volunteers', /*checkUserLogged,*/ volunteerRouter);
app.use('/api/time', /*checkUserLogged,*/ timeRouter);
app.use('/api/events', /*checkUserLogged,*/ eventsRouter);

// app.use('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
// });

module.exports = app;