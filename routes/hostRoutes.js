let express = require("express");

let hostRoutes = express.Router();

let {
  addHome,
  postHome,
  getHostHomes,
  getEditHome,
  postEditHome,
  postDeleteHome,
} = require("../controller/host");
hostRoutes.get("/add-home", addHome);
hostRoutes.post("/add-home", postHome);
hostRoutes.get("/host-home-list", getHostHomes);
hostRoutes.get("/edit-home/:homeId", getEditHome);
hostRoutes.post("/edit-home", postEditHome);
hostRoutes.post("/delete-home/:homeId", postDeleteHome);

exports.hostRoutes = hostRoutes;
