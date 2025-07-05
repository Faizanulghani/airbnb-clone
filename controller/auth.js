const { check, validationResult } = require("express-validator");
const user = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login to airbnb",
    currentPage: "login",
    isLoggedIn: false,
    errors: "",
    oldInput: { email: "" },
    user:{}
  });
};
exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup to airbnb",
    currentPage: "signup",
    isLoggedIn: false,
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "",
    },
    user:{}
  });
};
exports.postLogin = async (req, res, next) => {
  let { email, password } = req.body;

  let findUser = await user.findOne({ email });

  if (!findUser) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login to airbnb",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: { email },
    user:{}
    });
  }

  let isMatch = await bcrypt.compare(password, findUser.password);

  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login to airbnb",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: { email },
      user:{}
    });
  }

  req.session.isLoggedIn = true;
  req.session.findUser = findUser;
  await req.session.save();
  res.redirect("/");
};
exports.postSignup = [
  check("firstName")
    .notEmpty()
    .withMessage("First Name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name only contain letters"),
  check("lastName")
    .notEmpty()
    .withMessage("Last Name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last Name only contain letters"),
  check("email")
    .notEmpty()
    .withMessage("Please Enter a valid Email")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[~!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")
    .trim(),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),
  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),
  (req, res, next) => {
    let { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        isLoggedIn: false,
        errorMessages: errors.array().map((error) => error.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          userType,
          user:{}
        },
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        let users = new user({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return users.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Sign Up",
          isLoggedIn: false,
          errorMessages: [err.message],
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            userType,
            user:{}
          },
        });
      });
  },
];
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
