const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require("../helpers/mailer");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  //Traemos el email ---------------------------
  const email = req.body.email;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    //Hash del email ----------------------------
    const hashEmail = bcrypt.hashSync(email, salt);
    // hashEmail = hashEmail.replace(/\//g, '');


    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashEmail
    });


    newUser.save()
    //Manda email de verificacion
    let options = req.body;
    console.log("ups: ", options.username)
    options.filename = "verify"
    mailer.send(options)
      .then(() => {
        res.status(200).send("El correo se mando")
      })
      .catch(err => {
        console.log("Algo salió mal: ", err)
        res.status(500).json({
          err,
          "msg": "Algo salio mal"
        })
      })

  });


});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;