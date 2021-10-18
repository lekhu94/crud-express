var express = require('express');
var router = express.Router();
var connection = require('../database');
var bcrypt = require('bcrypt');

router.post('/', function (req, res) {
  var email = req.body.email;
  let query = `SELECT * FROM customers WHERE email = ?`;
  connection.query(query, [email], function (err, result) {
    if (err) throw err;

    if (result.length <= 0) {
      res.json({
        code: 201,
        message: 'Please enter correct email and Password!'
      })
    } else {
      bcrypt.compare(req.body.password, result[0].password, function (err, resp) {
        if (resp) {
          result[0].authdata = 'testing-authdata-token';
          console.log('result',result)
          res.json({
            code: 200,
            message: 'You are successfully logged in',
            user: result
          })
        } else {
          res.json({
            code: 201,
            message: 'Password is incorrect'
          })
        }
      })
    }
  });
});

module.exports = router;
