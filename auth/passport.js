const passport = require('passport');
const LocalStrategy = require('passport-local');
const Users = require('../models/users');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            let user = await Users.findOne({ username });
            if (!user) { return done(null, false); }
            // if (!user.verifyPassword(password)) { return done(null, false); }
            bcrypt.compare(password, user.password, function(err, result) {
                if (result == false) { return done(null, false); }
                return done(null, user);
            });
        }
        catch (err) {
            return done(err);
        }
    })
)

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
  let user = await Users.findById(id) 
    .then((user) => {
      done(null, user);
    })
    .catch(err => {
      done(err, false);
    })
});



module.exports = passport;