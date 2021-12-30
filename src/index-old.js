const express = require("express")
const hbs = require("hbs")
const path = require('path');
require("./db/mongoose")
const UserModel = require("./models/user")
const TaskModel = require("./models/task")

const app = express()
const port = process.env.PORT || 5001

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, './templates'))

app.use(express.json())

app.get('/user', (req, res) => {
    if(req.body){
        UserModel.find({}).then((result) => {
            res.status(200).send(result)
        }).catch((err)=> {
            res.status(400).send(err)
        })
    }else{
        res.send("Request body cannot be empty!")
    }
})

app.get('/user/:id', (req, res) => {
    if(req.body && req.params.id){
        const _id = req.params.id;
        UserModel.findById(_id).then((result) => {
            if(!result){
                res.status(404).send("User not found!")
            }

            res.send(result)
        }).catch((err)=> {
            res.status(500).send(err)
        })
    }else{
        res.send("Request body cannot be empty!")
    }
})

app.post('/user', (req, res) => {
    if(req.body){
        const userObj = new UserModel(req.body);
        
        userObj.save().then((result) => {
            res.status(201).send(userObj)
        }).catch((err) => {
            res.status(400).send(err)
        })
    }else{
        res.send("Request body cannot be empty!")
    }
})

app.get('/task', (req, res) => {
    if(req.body){
        TaskModel.find({}).then((result) => {
            res.status(200).send(result)
        }).catch(()=> {
            res.status(400).send(err)
        })
    }else{
        res.send("Request body cannot be empty!")
    }
})

app.get("/task/:id", (req, res) => {
    if(req.body && req.params.id){
        const _id = req.params.id;
        TaskModel.findById(_id).then((result) => {
            if(!result){
                res.status(404).send("Task not found!")
            }

            res.send(result)
        }).catch((err)=> {
            res.status(500).send(err)
        })
    }else{
        res.send("Request body cannot be empty!")
    }
})

app.post('/task', (req, res) => {
    if(req.body){
        const taskObj = new TaskModel(req.body);
        
        taskObj.save().then((result) => {
            res.status(201).send(taskObj)
        }).catch((err) => {
            res.status(400).send(err)
        })
    }else{
        res.send("Request body cannot be empty!")
    }
})

app.get('*', (req, res)=>{
    res.render('404')
})

app.listen(port, () => {
    console.log("Server is up on port: "+port);
})