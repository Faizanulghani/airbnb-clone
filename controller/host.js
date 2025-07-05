const Home = require("../models/home");

exports.addHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.findUser,
  });
};
exports.getEditHome = (req, res, next) => {
  let homeId = req.params.homeId;
  let editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit Your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.findUser,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.findUser,
    });
  });
};

exports.postHome = (req, res, next) => {
  const { houseName, price, location, rating, description, id } = req.body;
  let home = new Home({ houseName, price, location, rating, description, id });
  home.save().then(() => {
    console.log("Home Added Successfully");
  });
  res.redirect("/host/host-home-list");
};
exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  Home.findById(id)
    .then((home) => {
      (home.houseName = houseName),
        (home.price = price),
        (home.location = location),
        (home.rating = rating),
        (home.description = description),
        home
          .save()
          .then((result) => {
            console.log("Home Updated", result);
          })
          .catch((err) => {
            console.log("Home While Updating", err);
          });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding Home", err);
    });
};

exports.postDeleteHome = (req, res, next) => {
  let homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log(error);
    });
};
