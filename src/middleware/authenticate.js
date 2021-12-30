const jwt = require("jsonwebtoken")
const User = require("../models/user")
const constants = require("../json/constants.json")

const auth = async (req, res, next) => {
    try{    
        const token = req.header("Authorization").replace('Bearer ', '')
        const decodedToken = jwt.verify(token, constants.JWT_SECRET_KEY)

        const user = await User.findOne({_id: decodedToken._id})
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send("You are not authorized.");
    }
}

module.exports = auth;