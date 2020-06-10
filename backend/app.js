require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('./auth/passport');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const volunteersRouter = require('./routes/volunteers');
const fellowsRouter = require('./routes/fellows');
const skillsRouter = require('./routes/skills');
const eventsRouter = require('./routes/events');
const cohortsRouter = require('./routes/cohorts');
const mentorPairsRouter = require('./routes/mentorPairs');
const eventAttendeesRouter = require('./routes/eventAttendees');
const viewTypeRouter = require('./routes/viewType');


const { checkUserLogged } = require('./auth/helpers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth', authRouter);
app.use('/api/users', checkUserLogged, usersRouter);
app.use('/api/volunteers', /*checkUserLogged,*/ volunteersRouter);
app.use('/api/fellows', /*checkUserLogged,*/ fellowsRouter);
app.use('/api/skills', /*checkUserLogged,*/ skillsRouter);
app.use('/api/events', /*checkUserLogged,*/ eventsRouter);
app.use('/api/cohorts', /*checkUserLogged,*/ cohortsRouter);
app.use('/api/mentor_pairs', /*checkUserLogged,*/ mentorPairsRouter);
app.use('/api/event_attendees', /*checkUserLogged,*/ eventAttendeesRouter);
app.use('/api/view', checkUserLogged, viewTypeRouter);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
});

module.exports = app;