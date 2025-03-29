import session from "express-session";
import flash from "connect-flash";

const sessionConfig = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "library_secret_key",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 12 * 60 * 60 * 1000, //  24h
      },
    })
  );
  app.use(flash());

  app.use((req, res, next) => {
    if (!req.session) {
      return next(new Error("Session not initialized"));
    }
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.user = req.session.user || null;
    next();
  });
};

export default sessionConfig;
