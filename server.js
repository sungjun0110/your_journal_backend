import express from 'express';
import Cors from 'cors';
import mongoose from 'mongoose';

import User from './models/user_model.js';
import Journal from './models/journal_model.js';

// App Config
const app = express();
const port = process.env.PORT || 8001;

// Middlewares
app.use(Cors());
app.use(express.json());

// DB Config
mongoose.connect('mongodb://localhost/urjournal', {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully")
});

// API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello, this is your_journal_backend!"));

app.post("/register", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: "user already exists",
    });
    return;
  }
  await User.create({ username, password });
  res.send({
    message: "success",
  });
});

app.post("/login", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "user does not exist",
    });
    return;
  }

  res.send({
    message: "success",
  })
});

app.post("/journals", async (req, res) => {
  const {username, title, content, date} = req.body;

});

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));
