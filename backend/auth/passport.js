const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { comparePasswords } = require('./helpers');
const usersQueries = require('../queries/users');
const adminQueries = require('../queries/admin');
const volunteersQueries = require('../queries/volunteers');
const fellowsQueries = require('../queries/fellows');


passport.use(new LocalStrategy({usernameField: 'email', passwordField : 'password', passReqToCallback: true}, 
  async (request, username, password, done) => {
  try {
    const email = username.trim().toLowerCase();
    let user = await usersQueries.getUserByEmail(email);
    if (!user) { // user not found in the database
      console.log('AUTHENTICATION - user not found in the database');
      return done(null, false, {message: 'User not found'});
    }

    const passMatch = await comparePasswords(password, user.password);
    if (!passMatch) { // user found but passwords don't match
    console.log('AUTHENTICATION password not matching');
      return done(null, false, {message: 'Incorrect password'});
    }

    if (user.role === 'admin') {
      user = await adminQueries.getAdminByEmail(email);
    } else if (user.role === 'volunteer') {
      user = await volunteersQueries.getVolunteerByEmail(email);
    } else {
      user = await fellowsQueries.getFellowByEmail(email);
    }

    done(null, user);

  } catch (err) {
    done(err);
  }
}))

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser(async (user, done) => {
  done (null, user);
})

module.exports = passport;