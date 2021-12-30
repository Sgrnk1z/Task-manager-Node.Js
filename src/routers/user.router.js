const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const router = new express.Router()
const UserModel = require("../models/user")
const authMiddleware = require("../middleware/authenticate")

router.post("/login", async (req, res) => {
    try{
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token, message: "Login successful"})    
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/logout", authMiddleware, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(f => f.token !== req.token)
        await req.user.save()

        res.send({message: "Logged out"})
    }catch(e){
        res.status(500).send(e)
    }
})

router.get("/logout/all", authMiddleware, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save()

        res.send({message: "Logged out"})
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/user', authMiddleware, async (req, res) => {
    if(req.body){
        try{
            const users = await UserModel.find({})
            res.status(302).send(users)
        }
        catch(error){
            res.status(400).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.get('/user/me', authMiddleware, async (req, res) => {
    res.status(302).send(req.user)
})

router.get('/user/:id', authMiddleware, async (req, res) => {
    if(req.body && req.params.id){
        const _id = req.params.id;
        try{
            const userObj = await UserModel.findById(_id);
            if(!userObj){
                res.status(404).send("User not found!")
            }
            res.status(302).send(userObj)
        }catch(error){
            res.status(500).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.patch("/user/:id", authMiddleware, async (req, res) => {
    if(req.body && req.params.id){
        const _id = req.params.id;
        const updates = Object.keys(req.body)
        try{
            // Using save insted of update to trigger before-save middleware.....
            const user = await UserModel.findById(_id);
            updates.forEach((update) => user[update] = req.body[update])
            const usr = await user.save();
            // const user = await UserModel.findByIdAndUpdate(_id, req.body);
            if(!usr){
                res.status(404).send("User not found!")
            }
            res.status(202).send(usr)
        }catch(error){
            res.status(500).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.delete("/user/:id", authMiddleware, async (req, res) => {
    if(req.body && req.params.id){
        const _id = req.params.id;
        try{
            const user = await UserModel.remove({_id});
            if(!user){
                res.status(404).send("User not found!")
            }
            res.status(202).send(user)
        }catch(error){
            res.status(500).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.post('/user', async (req, res) => {
    if(req.body){
        try{
            const userObj = await UserModel.create(req.body);
            // const createdUser = await userObj.save();
            res.status(201).send(userObj)
        }catch(err){
            res.status(400).send(err.message? err.message : err)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

const upload = multer({
    dest: "avatars",
    limits: {
        fileSize: 5000000 //max 5 mb
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(|jpg|jpeg|png)$/)){
            return cb(new Error("Only images are accepted"))
        }
        cb(undefined, true)
    }
})
router.post('/user/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    // const buffer = await sharp(req.file).resize({width: 250, height: 250}).png().toBuffer()
    // req.user.avatar = buffer
    // await req.user.save()
    res.status(201).send()
}, (err, req, res, next) => {
    res.status(400).send({error: err.message})
})

module.exports = router