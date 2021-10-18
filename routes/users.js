var express = require('express');
var router = express.Router();
var connection = require('../database');
var bcrypt = require('bcrypt');


/* Get user list */
router.get('/', function (req, res) {
  let query = `SELECT * FROM customers`;
  let defaultquery = `ORDER BY id DESC LIMIT ${req.query.limit}`;
  let role = `WHERE role = '${req.query.role}' ${defaultquery}`;
  let search = `WHERE name LIKE '%${req.query.search}%' ${defaultquery}`;
  let bothfilter = `${query} WHERE (role = '${req.query.role}') AND (name LIKE '%${req.query.search}%') ${defaultquery}`;

  if(req.query.role && !req.query.search) query = `${query} ${role}`;
  else if(req.query.search && !req.query.role) query = `${query} ${search}`;
  else if(req.query.role && req.query.search) query = bothfilter;
  else query = `${query} ${defaultquery}`;
  connection.query(query, function (err, result) {
    if (err) throw err;
    let response = { code: 200, message: 'Users fetched successfully', data: result }
    res.send(response)
  })
})

/* User profile */
router.get('/:id', function (req, res) {
  var id = req.params.id;
  let query = `SELECT * FROM customers WHERE id = "${id}"`;
  connection.query(query, function (err, result) {
    if (err) throw err;
    res.json({
      code: 200,
      message: 'Users fetched successfully',
      data: result
    })
  })
})

/* Delete user */
router.delete('/delete/:id', function (req, res) {
  let query = 'DELETE FROM customers WHERE id=' + req.params.id;
  connection.query(query, function (err, result) {
    if (err) throw err;
    let response = { code: 200, message: 'Users deleted successfully' }
    res.send(response)
  })
})

/* Add user */
router.post('/add', async function (req, res) {
  var email = req.body.email;
  let query = `SELECT * FROM customers WHERE email = "${email}"`;
  connection.query(query, function (err, result) {
    if (err) throw err;
    if (result.length === 0) {
      var inputData = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
      }
      let query = `INSERT INTO customers SET ?`;
      connection.query(query, inputData, function (err, result) {
        if (err) throw err;
      });
      res.json({
        code: 200,
        message: 'User addedd successfully'
      })
    } else {
      res.json({
        code: 201,
        message: 'Email id "' + email + '" is already taken'
      })
    }
  });
});

/* Update User Info */
router.put('/edit/:id', function (req, res) {
  let query = 'UPDATE customers SET ? WHERE id='+req.params.id+'';
  connection.query(query, [req.body], function (err, result) {
    if (err) throw err;
  });
  res.json({
    code: 200,
    message: 'User updated successfully'
  })
})

module.exports = router;
