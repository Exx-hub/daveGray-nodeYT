const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  const foundUser = usersDB.users.find(
    (person) => person.username === username
  );

  if (!foundUser) {
    res.status(401).json({
      success: false,
      message: "Username unrecognized.",
    }); // unauthorized
  }

  // evaluate password / authorize login
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // create access token and refresh token
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // SAVING REFRESH TOKEN WITH CURRENT USER
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );

    const currentUser = { ...foundUser, refreshToken };

    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // send cookie to client unavailable through javascript just accessible from the browser
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    res.json({
      success: true,
      messsage: `User ${username} logged in.`,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Incorrect password.",
    });
  }
};

module.exports = { handleLogin };
