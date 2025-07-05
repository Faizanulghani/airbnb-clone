let express = require("express");
let path = require("path");
let useRoutes = require("./routes/userRoutes");
let { hostRoutes } = require("./routes/hostRoutes");
let authRoutes = require("./routes/authRoutes");
let session = require("express-session");
let MongoDBSession = require("connect-mongodb-session")(session);
let DBPath =
  "mongodb+srv://root:root@paractice.rjwabzm.mongodb.net/airbnb?retryWrites=true&w=majority&appName=paractice";

let app = express();

app.set("view engine", "ejs");
app.set("views", "views");

let store = new MongoDBSession({
  uri: DBPath,
  collection: "sessions",
});

app.use(express.urlencoded());
app.use(
  session({
    secret: "Faizan Ul Ghani",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();
});
app.use(useRoutes);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRoutes);
app.use(authRoutes);

app.use(express.static(path.join(__dirname, "public")));
let { error } = require("./controller/error");
const { default: mongoose } = require("mongoose");
app.use(error);

mongoose.connect(DBPath).then(() => {
  app.listen(3001);
});
