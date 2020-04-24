var User = require('../models/userModel');
var _ = require('lodash');

/* Get a list of users  */
const getUsers = async function(req, res, next) {
    try {
        const user = await User.find().select('username email phone');
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err)
    }
}

/* Get a single user */
const getSingleUser = async function(req, res, next) {
    try {
        const id = req.params.userId;
        const user = await User.findById(id).select('username email phone');
        res.status(200).json(user);
    } catch(err) {
        res.status(400).json({
            message: err
        })
    }
}

/* Create a new user and store in the database */
const signup = async function(req, res, next) {
    try{
        let user = new User(_.pick(req.body, ['username', 'email', 'phone', 'isEmployer']));
        user.setPassword(req.body.password);
        await user.save();
        return res.status(200).send('All ok!');
    } catch(error) {
        res.status(500).json(error);
    };
}

/* Authorize a user */
const login = async function(req,res,next){
    try {
        let user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const passCheck = await user.validPassword(req.body.password);
        if(!passCheck){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const token = await user.toAuthJSON();
        res.status(200).json(token);
    } catch(error) {
        res.status(500).json(error);
    }
}

module.exports = {
    login,
    signup,
    getUsers,
    getSingleUser
}