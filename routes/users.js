var express = require('express');
var router = express.Router();
var connection = require('../database');
var bcrypt = require('bcrypt');

/* Add user */
router.post('/add', function (req, res) {
  var inputData = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,
  }
  var email = req.body.email;
  let query = `SELECT * FROM customers WHERE email = ?`;
  connection.query(query, [email], function (err, result) {
    if (err) throw err;
    var response;
    console.log('result',result)
    if (result.length > 0) response = { code: 201, message: 'Email id "' + email + '" is already taken' }
    else {
      let query = `INSERT INTO customers SET ?`;
      connection.query(query, inputData, function (err, result) {
        if (err) throw err;
        response = { code: 200, message: 'User addedd successfully' }
      });
    }
    res.send(response);
  });
});



module.exports = router;
