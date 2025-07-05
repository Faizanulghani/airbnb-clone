exports.error = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page not Found",
    currentPage: 404,
    isLoggedIn: req.isLoggedIn,
    user: req.session.findUser,
  });
};
