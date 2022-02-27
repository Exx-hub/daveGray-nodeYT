// ROUTE HANDLERS
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello html");
    next();
  },
  (req, res) => {
    res.send("hello wolrd");
  }
);

// chaining route handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("finished");
};

app.get("/chain(.html)?", [one, two, three]);
// app.get("/chain(.html)?", one, two, three);

// error handler

// app.get("/*", (req, res) => {
//   // res.status(400);
//   res.status(400).sendFile(path.join(__dirname, "views", "404.html"));
// });
