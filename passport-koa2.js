const passport = require("passport");
passport._authenticate = passport.authenticate;
passport.authenticate = function(strategy, options, callback) {
  return ctx =>
    new Promise((resolve, reject) => {
      const query = Object.assign(
        {},
        ctx.payload || {},
        ctx.request && ctx.request.fields ? ctx.request.fields : {},
        ctx.query || {}
      );
      const express = {
        req: {
          flash: (type, message) => {
            // console.log("flash", type, message);
          },
          query: Object.assign(query, {
            redirect_uri: query.redirect_uri || query.redirectUri
          }),
          body: Object.assign(query, {
            redirect_uri: query.redirect_uri || query.redirectUri
          }),
        },
        res: {
          end: message => {
            ctx.status = express.res.statusCode;
            resolve();
          },
          setHeader: (key, value) => ctx.set(key, value)
        }
      };
      callback =
        !callback && typeof options === "function"
          ? (err, result, credentials, statusCode) => {
            ctx.status = express.res.statusCode || statusCode || 200;
            const nerr = statusCode === 400 && !err ? credentials : err;
            options(nerr, result, ctx, express);
          }
          : (err, result, credentials, statusCode) => {
              const nerr = statusCode === 400 && !err ? credentials : err;
              if (nerr) return reject(nerr);
              ctx.status = express.res.statusCode || statusCode || 200;
              ctx.body = result;
              resolve(result);
            };
      options = !callback && typeof options === "function" ? {} : options || {};
      passport._authenticate(strategy, options, callback)(
        express.req,
        express.res
      );
    });
};
passport._initialize = passport.initialize;
passport.initialize = function() {
  return ctx => new Promise(resolve => passport._initialize()(ctx, undefined, resolve));
};
module.exports = passport;
