const express = require("express");
const path = require('path');
const PORT = 8000;
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/User');
const Youtube = require('./model/Youtube');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'asdasdasdadasf23@#@#@#@!#!#@DASD';

mongoose.connect("mongodb+srv://baophung:Bao123456@shareyoutube.tbcdk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useNewUrlParser: true,  useUnifiedTopology: true})

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());


/**
 * Login
 */
app.post('/api/login', async (req, res) => {
  const {
    username, password
  } = req.body;
  const user = await User.findOne({ username }).lean();

  if(!user) {
    return res.json({
      status: 'error', error: 'Invalid username/password'
    });
  }

  if(await bcrypt.compare(password, user.password)) {
    //  the username, password combination is successful
    const token = jwt.sign({ 
      id: user._id, 
      username: user.username
    }, JWT_SECRET);
    return res.json({
      status: 'ok', data: token
    });
  }


  res.json({ status: 'error', error: 'Invalid username/password'})
});

/**
 * Register User
 */
app.post('/api/register', async (req, res) => {
  console.log('req', req.body);
  const { username, password: plainTextPassword } = req.body;

  if(!username || typeof username !== 'string') {
    return res.json({
      status: 'error',
      error: 'Invalid username'
    })
  }

  if(!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({
      status: 'error',
      error: 'Invalid password'
    })
  }

  if(plainTextPassword.length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    })
  }

  const password = await bcrypt.hash(plainTextPassword, 10);
  
  try {
    const response = await User.create({
      username,
      password
    });
    console.log('User created', response)
  } catch(error) {
    console.log(JSON.stringify(error));
    if(error.code === 11000) {
      //duplicate key
      return res.json({ status: 'error', error: 'Username already in use'});
    }
    throw error
  }
  
	res.json({ status: 'ok' })
});

/**
 * Share source youtube
 */
 app.post('/api/share', async (req, res) => {
  console.log('req', req.body);
  const { source } = req.body;

  if(!source || typeof source !== 'string') {
    return res.json({
      status: 'error',
      error: 'Invalid source'
    })
  }

  if(source.length < 5) {
    return res.json({
      status: 'error',
      error: 'Source too small. Please enter correct source!!!'
    })
  }

  try {
    const response = await Youtube.create({
      source
    });
    console.log('Share success', response)
  } catch(error) {
    console.log(JSON.stringify(error));
    throw error;
  }
  
	res.json({ status: 'ok' })
});

/**
 * Get list youtube
 */
app.get('/api/share/list', async (req, res) => {
  console.log('req', req.body);
  try {
    const response = await Youtube.find();
    res.json({ status: 'ok', data: response })
    // console.log('Share success', response)
  } catch(error) {
    console.log(JSON.stringify(error));
    throw error;
  }
});
app.listen(PORT, () => {
  console.log(`Server up at ${PORT}`);
})