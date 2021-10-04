var express = require('express');
var router = express.Router();
var connection = require('../database');

router.post('/', function (req, res) {
  var email = req.body.email;
  let query = `SELECT * FROM customers WHERE email = ?`;
  connection.query(query, [email], function (err, result) {
    if (err) throw err;

    let response;
    if (result.length <= 0) response = { code: 201, message: 'Please enter correct email and Password!', user: null }
    else response = { code: 200, message: 'You are successfully logged in', user: result }
    res.send(response);
  });
});

module.exports = router;
