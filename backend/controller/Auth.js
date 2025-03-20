const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/authservecies");
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const { token, role } = req.user;
  res
    .cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(200)
    .json({ token, role });
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();
    const resetPageLink =
      "https://mern-ekart-project.vercel.app/reset-password?token=" +
      token +
      "&email=" +
      email;
    const subject = "Reset password for e-commerce";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password<p>`;

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    }
  } else {
    res.sendStatus(401);
  }
};
exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  const user = await User.findOne({ email, resetPasswordToken: token });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = "Password  successfully reset for e-commerce";
        const html = `<p>Successfully able to Reset Password<p>`;

        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(401);
        }
      }
    );
  } else {
    res.sendStatus(401);
  }
};
exports.logout = async (req, res) => {
  console.log("logout");
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now() + 10),
      httpOnly: true,
    })
    .sendStatus(200);
};
