# Passport-koa2

Passport-koa2 is [Koa](https://koajs.com/)-compatible authentication
middleware for [Node.js](http://nodejs.org/).
  
This package is not an official [Passport](https://www.npmjs.com/package/passport) package  
It was developed willingly only for his compatibility with koa framework  
  
---

## Install

```
$ npm install --save passport-koa2
```

## Usage

#### Configure Strategy

The local authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

```js
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'local'` strategy, to
authenticate requests. It searches for fields in the query string and
`ctx.body`, so ensure body parsers are in place if these fields are
sent in the body.

For example, as route middleware in an [Koa](http://koajs.com/)
application:

```js
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }));
```
  
Callback:  

```js
app.post('/login', passport.authenticate('local', (err, result, ctx) => {
 //
}));
```

There are 480+ strategies. Find the ones you want at: [passportjs.org](http://passportjs.org)
