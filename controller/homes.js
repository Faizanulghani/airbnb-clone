const Home = require("../models/home");
const user = require("../models/user");

exports.getHome = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.findUser,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "index Home",
      currentPage: "Index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.findUser,
    });
  });
};

exports.getBooking = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "booking",
    isLoggedIn: req.isLoggedIn,
    user: req.session.findUser,
  });
};

exports.getfavourite = async (req, res, next) => {
  let userId = req.session.findUser._id;
  let findUser = await user.findById(userId).populate("favourites");
  res.render("store/favorite-list", {
    favouriteHomes: findUser.favourites,
    pageTitle: "Favourite List",
    currentPage: "Favourite",
    isLoggedIn: req.isLoggedIn,
    user: req.session.findUser,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  let userId = req.session.findUser._id;
  let findUser = await user.findById(userId);

  if (!findUser.favourites.includes(homeId)) {
    findUser.favourites.push(homeId);
    await findUser.save();
  }

  res.redirect("/favourite");
};

exports.postRemoveToFavourite = async (req, res) => {
  let homeId = req.params.homeId;
  let userId = req.session.findUser._id;
  let findUser = await user.findById(userId);
  if (findUser.favourites.includes(homeId)) {
    findUser.favourites = findUser.favourites.filter((fav) => fav != homeId);
    await findUser.save();
  }
  res.redirect("/favourite");
};

exports.getHomeDetails = (req, res, next) => {
  let homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    if (!home) {
      return res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Details",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.findUser,
      });
    }
  });
};
