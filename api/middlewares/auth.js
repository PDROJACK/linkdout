const jwt = require('jsonwebtoken');


const auth = function(req,res,next){
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,process.env.SECRET);
        req.userData = decoded; 
        next();
    } catch(error) {
        res.status(401).json({
            message: "Auth failed"
        });
    }
};

module.exports = {
    auth
};