const Auth = {};
const Keys = require('../config/keys')
const jwt = require('jsonwebtoken')

Auth.generateAccessToken = (id,email, result)=> {
    jwt.sign({ id:id, email:email }, Keys.secretOrKey, { expiresIn: '15m' },(err,res)=>{
        if(err){
            result(err,null)
        }
        result(null,res)
    });
};

Auth.generateRefreshToken = (userId)=> {
    return jwt.sign({ userId }, Keys.secretOrKey, { expiresIn: '7d' });
}


module.exports = Auth;