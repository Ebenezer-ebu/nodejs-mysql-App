const Validator = require("fastest-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("../models");

function signUp(req, res) {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const schema = {
    name: { type: "string", optional: false, max: "100" },
    email: { type: "string", optional: false, max: "256" },
    password: { type: "string", optional: false, min: "8" },
  };
  const v = new Validator();
  const validationResponse = v.validate(data, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  }
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcryptjs.genSalt(10, function (err, salt) {
          bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const user = {
              name: req.body.name,
              email: req.body.email,
              password: hash,
            };

            models.User.create(user)
              .then((result) => {
                res.status(201).json({
                  message: "User created successfully",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong",
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
      });
    });
}

function login(req, res) {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const schema = {
    email: { type: "string", optional: false, max: "256" },
    password: { type: "string", optional: false, min: "8" },
  };
  const v = new Validator();
  const validationResponse = v.validate(data, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  }
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: "Invalid credentials",
        });
      } else {
        bcryptjs.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user.id,
                },
                process.env.JWT_KEY,
                function (err, token) {
                  res.status(200).json({
                    message: "Authentication Successful!",
                    token,
                  });
                }
              );
            } else {
              res.status(401).json({
                message: "Invalid credentials",
              });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
      });
    });
}

module.exports = { signUp, login };
