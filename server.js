const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 8000;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`)
})

const bcrypt = require('bcrypt');

const User = require('./models/User');
mongoose.connect('mongodb://localhost/userData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

function returnValue(userID) {
  return new Promise((resolve, reject) => {
      mongoose.connect('mongodb://localhost/userData', (err, db) => {
      db.collection('users').find({ id: userID }).toArray((err, result) => {
        if (result != null) {
          const successObject = {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
            password: result[0].password
          };
          resolve(successObject);
        } else {
          const errorObject = {
            msg: 'An error occured',
            error, //...some error we got back
          }
          reject(errorObject);
        }
      });
    });
  });
}

function sendResponse(res, err, data) {
  if (err) {
    res.json({
      success: false,
      message: err
    })
  } else if (!data) {
    res.json({
      success: false,
      message: "Not Found"
    })
  } else {
    res.json({
      success: true,
      data: data
    })
  }
}

app.post('/login', function (req, res) {

returnValue("620fa8b52ff4185250e59e06").then(user => {
    const validPassword =  bcrypt.compareSync(req.body.password, user.password); 
    if (validPassword == true) {
      res.json({
        success: true,
        message: 'password and username match!',
        token: 'encrypted token goes here'
      })
    } else {
      res.json({
        success: false,
        message: 'password and username do not match'
      })
    }
  });
})

app.post('/users', (req, res) => {
    User.create(
      {...req.body.newData},
      (err,data)=>{sendResponse(res,err,data)}
    )
})

app.route('/users/:id')
  // READ
  .get((req, res) => {
    User.findById(req.params.id,
      (err, data) => { sendResponse(res, err, data) }
    )
  })

  // UPDATE
  .put((req, res) => {
    User.findByIdAndUpdate(
      User.findByIdAndUpdate(
        req.params.id,
        {...req.body.newData},
        {new:true},
        (err,data)=>{sendResponse(res,err,data)})
    )
  })

  // DELETE
  .delete((req, res) => {
    User.findByIdAndDelete(
      req.params.id,
      (err, data) => { sendResponse(res, err, data) })
  })

