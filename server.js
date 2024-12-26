const dotenv = require("dotenv");
dotenv.config();

// const port = process.env.PORT;
const port = 5000;
const express = require("express");
const app = express();
const mongose = require("mongoose");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Database connected sucessfully ${mongoose.connection.host}`);
  })
  .catch((err) => {
    console.log(`Connection Failed, err`);
  });
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: String,
});

const userModel = mongoose.model("user", userSchema);

app.use(express.json());
app.use(cors());

//to create users
app.post("/create", async (req, res) => {
  const register = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
  });

  await register.save();
  res.send(register);
});

app.get("/", async (req, res) => {
  const data = await userModel.find({});
  res.send(data);
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const data = await userModel.findById(id);
  res.send(data);
});

app.delete("/users/:id", async (req, res) => {
  // console.log(req.params.id  );
  const { id } = req.params;
  const data = await userModel.findByIdAndDelete(id);
  res.send(`User with id ${id} has been deleted sucessfully `);
});

//for update

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const data = await userModel.findByIdAndUpdate(id, body, { new: true });
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
