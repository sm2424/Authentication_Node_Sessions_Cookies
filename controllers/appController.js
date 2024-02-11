// controllers/appController.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.landing_page = (req, res) => {
  res.render("landing");
};

exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (!results || !results.length || !(await bcrypt.compare(password, results[0].password))) {
      req.session.error = "Invalid Credentials";
      return res.redirect("/login");
    }
    req.session.isAuth = true;
    req.session.username = results[0].username;
    res.redirect("/dashboard");
  });
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  const { username, email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (results && results.length) {
      req.session.error = "User already exists";
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    db.query('INSERT INTO users SET ?', { username, email, password: hashedPassword }, (error, results) => {
      if (error) {
        console.error(error);
        req.session.error = "Error creating user";
        return res.redirect("/register");
      }
      res.redirect("/login");
    });
  });
};

exports.dashboard_get = (req, res) => {
  const username = req.session.username;
  res.render("dashboard", { name: username });
};

exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/login");
  });
};
