const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user')
const artistRoutes = require('./routes/artist')
const albumRoutes = require('./routes/album');

app.use(express.json())

app.use('/api/v1',authRoutes);
app.use('/api/v1',userRoutes);
app.use('/api/v1',artistRoutes);
app.use('/api/v1',albumRoutes);

app.use('/api/v1',(req,res,next) => {
    res.send({message: "API-V1: Server is running"});
})
app.use('/', (req,res,next) => {
    res.send({message: "Server is running"});
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(8000);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });