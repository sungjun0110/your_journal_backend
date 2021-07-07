import express from 'express';
import Cors from 'cors';
import mongoose from 'mongoose';

import User from './models/user_model.js';
import Journal from './models/journal_model.js';

// App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = 'mongodb+srv://admin:zN2yWWN2b94mlWGm@cluster0.asois.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Middlewares
app.use(Cors());
app.use(express.json());

// DB Config
mongoose.connect(connection_url, 
  {useNewUrlParser: true, useUnifiedTopology: true}
);
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
  const { authorization } = req.headers;
  const [username, password] = authorization.split(":");
  const user = await User.findOne({ username }).exec();
  const journalsItems = req.body;
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "user does not exist",
    });
    return;
  }
  const journals = await Journal.findOne({ author: username }).exec();
  if (!journals) {
    await Journal.create({
      author: username,
      journals: journalsItems,
    })
  } else {
    journals.journals = journalsItems;
    await journals.save();
  }
  res.json(journalsItems);
});

app.get("/journals", async (req, res) => {
  const { authorization } = req.headers;
  const [username, password] = authorization.split(":");
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "user does not exist",
    });
    return;
  }
  const { journals } = await Journal.findOne({ author: username }).exec();
  res.json(journals.reverse());
});

app.delete("/journals", async (req, res) => {
  const { authorization } = req.headers;
  const [username, password] = authorization.split(":");
  const journals = await Journal.findOne({ author: username }).exec();
  const journal = journals.journals;
  if (!journals) {
    res.status(403);
    res.json({
      message: "Journal for this user does not exist",
    })
    return;
  } else {
    for (let i = 0; i < journal.length; i++) {
      if (journal[i]._id == req.headers.id) {
        journal.splice(i, 1);
      }
    }
    await journals.save();
  }
  res.json(journal);
})

app.put("/journals", async (req, res) => {
  const { authorization } = req.headers;
  const [username, password] = authorization.split(":");
  const journalsRaw = await Journal.findOne({ author: username }).exec();
  const journals = journalsRaw.journals;
  const journal = journals.find(element => element._id == req.body.id);
  if (!journal) {
    res.status(403);
    res.json({
      message: "Journal does not exist",
    })
    return;
  } else {
    journal.title = req.body.title;
    journal.content = req.body.content;
    await journalsRaw.save();
  }
  res.json(journal);
})

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));
