const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

require("dotenv").config();

const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const homePage = require("./routes/home");

const app = express();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const passwordRoutes = require("./routes/password");

const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static("public"));
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);
app.use(homePage);


mongoose.connect(process.env.MONGO_CONNECT)
  .then((res) => {
    app.listen(process.env.PORT);
  })
  .catch((e) => console.log(e));
