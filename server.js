import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// DB Config
mongoose.connect('mongodb://localhost/urjournal', {useNewUrlParser: true, useUnifiedTopology: true});

// API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello, this is your_journal_backend!"));

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

// Listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));
