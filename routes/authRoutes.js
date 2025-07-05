let express = require("express");

let authRouter = express.Router();
const { getLogin, postLogin, postLogout, getSignUp, postSignup } = require("../controller/auth");

authRouter.get("/login", getLogin);
authRouter.get("/signup", getSignUp);
authRouter.post("/login", postLogin);
authRouter.post("/signup", postSignup);
authRouter.post("/logout", postLogout);

module.exports = authRouter;
