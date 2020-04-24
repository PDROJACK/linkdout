var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.getUsers);


/* GET single user. */
router.get('/:userId', userController.getSingleUser);


/* SIGNUP. */
router.post('/signup', userController.signup);


/* LOGIN */
router.post('/login', userController.login);


module.exports = router;
