const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// Claves embebidas (sin .env)
//const PEPPER = "claveultrasecreta";
const JWT_SECRET = "supersecreto";//.ENV NO SIRVE POR ESO LO PUSE AQUI 

// Registro de usuario
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, permissions } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "El correo ya está en uso" });
    }

    const hashedPassword = await argon2.hash(password);

    user = new User({
      name,
      email,
      password: hashedPassword,
      permissions,
    });

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Login de usuario

exports.login = async (req, res) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      console.log("user")
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      console.log("contraseña")
      return res.status(400).json({ msg: "Credenciales inválidas-contraseña" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};
