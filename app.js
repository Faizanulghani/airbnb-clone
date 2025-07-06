let express = require("express");
let path = require("path");
let useRoutes = require("./routes/userRoutes");
let { hostRoutes } = require("./routes/hostRoutes");
let authRoutes = require("./routes/authRoutes");
let session = require("express-session");
let multer = require("multer");
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

let randomString = (length) => {
  let charactor = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charactor.charAt(Math.floor(Math.random() * charactor.length));
  }
  return result;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") cb(null, "uploads/");
    else if (file.fieldname === "rules") cb(null, "rules/");
  },
  filename: function (req, file, cb) {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  let okImg = ["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype);
  let okPdf = file.mimetype == "application/pdf";
  okImg || okPdf ? cb(null, true) : cb(null, false);
};

app.use(
  multer({ storage, fileFilter }).fields([
    { name: "photo", maxCount: 1 },
    { name: "rules", maxCount: 1 },
  ])
);
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/rules", express.static(path.join(__dirname, "rules")));
app.use("/host/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/home/uploads", express.static(path.join(__dirname, "uploads")));

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

let { error } = require("./controller/error");
const { default: mongoose } = require("mongoose");
app.use(error);

mongoose.connect(DBPath).then(() => {
  app.listen(3001);
});
