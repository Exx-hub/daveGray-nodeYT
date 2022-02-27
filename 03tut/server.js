const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");

const rootRoutes = require("./routes/root");
const subdirRoutes = require("./routes/subdir");
const employeeRoutes = require("./routes/api/employees");
const registerRoutes = require("./routes/register");
const authRoutes = require("./routes/auth");
const refreshRoutes = require("./routes/refresh");
const logoutRoutes = require("./routes/logout");

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross origin resource sharing
app.use(cors(corsOptions));

// 1. BULT IN MIDDLEWARE
// used to handle url encoded data, form data
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built in middle ware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public"))); // "/" default path
// app.use("/subdir", express.static(path.join(__dirname, "/public"))); // serve static files to subdir too

// ROUTES
app.use("/", rootRoutes);
// app.use("/subdir", subdirRoutes);
// app.use("/subdir", require("./routes/subdir"));
app.use("/register", registerRoutes);
app.use("/auth", authRoutes);
app.use("/refresh", refreshRoutes);
app.use("/logout", logoutRoutes);
app.use("/employees", verifyJWT, employeeRoutes);

// will apply to all http requests
app.all("*", (req, res) => {
  // res.status(400);
  console.log("page not found?");

  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 page not found" });
  } else {
    res.type("txt").send("404 page not found");
  }
});

// handling errors in express
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
