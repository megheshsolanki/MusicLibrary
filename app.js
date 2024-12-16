const express = require('express')
const mongoose = require('mongoose');
const cors = requrie('cors');
require('dotenv').config()

const app = express();

app.use(cors());

const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user')
const artistRoutes = require('./routes/artist')
const albumRoutes = require('./routes/album');
const trackRoutes = require('./routes/track')
const favouriteRoutes = require('./routes/favourite')

app.use(express.json())

app.use('/api/v1',authRoutes);
app.use('/api/v1',userRoutes);
app.use('/api/v1',artistRoutes);
app.use('/api/v1',albumRoutes);
app.use('/api/v1',trackRoutes);
app.use('/api/v1',favouriteRoutes);

app.use('/api/v1',(req,res,next) => {
    res.send({message: "API-V1: Server is running"});
})
app.use('/', (req,res,next) => {
    res.send({message: "Server is running"});
})

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({status: status,data: data, message: null, error: message });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT);
    console.log("Connected");
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });