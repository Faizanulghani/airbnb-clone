let express = require("express");

let userRouter = express.Router();
let {
  getHome,
  getBooking,
  getfavourite,
  getIndex,
  getHomeDetails,
  postAddToFavourite,
  postRemoveToFavourite,
} = require("../controller/homes");

userRouter.get("/", getIndex);
userRouter.get("/home", getHome);
userRouter.get("/booking", getBooking);
userRouter.get("/favourite", getfavourite);
userRouter.get("/home/:homeId", getHomeDetails);
userRouter.post("/favourites", postAddToFavourite);
userRouter.post("/favourites/delete/:homeId", postRemoveToFavourite);

module.exports = userRouter;
