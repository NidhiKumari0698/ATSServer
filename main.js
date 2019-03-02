const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoOptions = { useNewUrlParser: true };
const router = require('./routes/route');

require('./models/candidate.model');
require('./models/AddJob.model');
require('./models/Login.model');
require('./models/JobAndCandidate.model');
require('./models/assignInterviewer.model')
require('./models/addInterviewer.model')

//database connection 
mongoose.connect('mongodb://localhost/ATS', mongoOptions)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('could not connect to mongoDB..', err));
//
app.use((req, res, next) => {
  console.log(`HIT AT: ${req.method} ${req.url}`);
  next();
})
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

app.listen(3001, function () {
  console.log('listen to port 3001');
})
