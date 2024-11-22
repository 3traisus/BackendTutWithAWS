const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('./keys')
const user = require('../models/user')

module.exports = (passport) =>{

    let opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = keys.secretOrKey

    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        user.findByid(jwt_payload.id,(err,user)=>{
            if(err){
                return done(err,false)
            }
            if(user){
                return done(null,user)
            }else{
                return done(null,false)
            }
        })
    }))
}