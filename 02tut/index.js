const fs = require("fs");
const path = require("path");

// fs.readFile(
//   path.join(__dirname, "files", "starter.txt"),
//   "utf8",
//   (err, data) => {
//     if (err) throw err;

//     console.log(data);
//     console.log("starter.txt created");
//   }
// );

// console.log("hello ");

fs.writeFile(
  path.join(__dirname, "files", "starter.txt"),
  "created starter.txt file",
  (err, data) => {
    if (err) throw err;

    console.log("Write complete");
  }
);

// fs.appendFile(
//   path.join(__dirname, "files", "reply.txt"),
//   "testing text",
//   (err, data) => {
//     if (err) throw err;

//     console.log("Append complete");
//   }
// );

// process.on("uncaughtException", (err) => {
//   console.error(err);
//   process.exit(1);
// });

const fsPromises = require("fs").promises;

// console.log(fsPromises);

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, "files", "starter.txt"),
      "utf8"
    );
    console.log(data);

    await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));
    await fsPromises.writeFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      data
    );
    await fsPromises.appendFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      "\n\nhello this is appended"
    );
    await fsPromises.rename(
      path.join(__dirname, "files", "promiseWrite.txt"),
      path.join(__dirname, "files", "endOfPromise.txt")
    );

    const newData = await fsPromises.readFile(
      path.join(__dirname, "files", "endOfPromise.txt"),
      "utf8"
    );
    console.log(newData);
  } catch (err) {
    console.error(err);
  }
};

fileOps();

// console.log(path.join(__dirname, "files", "starter.txt"));
