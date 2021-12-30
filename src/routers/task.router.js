const express = require("express")
const router = new express.Router
const TaskModel = require("../models/task")
const UserModel = require("../models/user")
const authMiddleware = require("../middleware/authenticate")

// task?completed=
// task?limit=&offset=
// task?sortBy=createdAt:desc
router.get('/task', authMiddleware, async (req, res) => {
    if(req.body){
        try{
        //     if(req.query.completed){
        //         if(req.query.completed == 'true'){
        //             const task = await TaskModel.find({completed: true}).populate('owner')
        //             res.status(302).send(task)
        //         }else{
        //             const task = await TaskModel.find({completed: false}).populate('owner')
        //             res.status(302).send(task)
        //         }
        //     }else{
        //         const task = await TaskModel.find({}).populate('owner')
        //         res.status(302).send(task)
        //     }

            const match = {}
            if(req.query.completed){
                match.completed = req.query.completed === 'true'
            }

            const sort = {}
            if(req.query.sortBy){
                const parts = req.query.sortBy.split(':')
                sort[parts[0]] = parts[1] === 'desc'? -1 : 1
            }

            await req.user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.limit * req.query.offset),
                    sort
                }
            })
            res.status(302).send(req.user.tasks)
        }
        catch(error){
            res.status(400).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.get('/task/me', authMiddleware, async (req, res) => {
        try{
            const task = await TaskModel.find({owner: req.user._id}).populate('owner')
            if(!task || !task.length){
                res.status(404).send("Task not found!")
            }
            res.status(302).send(task)
        }catch(err){
            res.status(500).send(error)
        }
})

router.get("/task/:id", authMiddleware, async (req, res) => {
    if(req.params.id){
        const _id = req.params.id;
        try{
            const task = await TaskModel.findById(_id).populate('owner')
            if(!task){
                res.status(404).send("Task not found!")
            }
            res.status(302).send(task)
        }catch(error){
            res.status(500).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.patch("/task/:id", authMiddleware, async (req, res) => {
    if(req.body && req.params.id){
        const _id = req.params.id;

        const updates = Object.keys(req.body)
        const allowUpdates = ['description', 'completed'];
        const isValid = updates.every((update) => allowUpdates.includes(update));

        if(!isValid){
            res.status(400).send({error: "Incorrect request body"});
        }

        try{
            const task = await TaskModel.findOneAndUpdate({_id, owner: req.user._id}, req.body).populate('owner');
            if(!task){
                res.status(404).send("Task not found!")
            }
            res.status(202).send(task)
        }catch(error){
            res.status(500).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.delete("/task/:id", authMiddleware, async (req, res) => {
    if(req.params.id){
        const _id = req.params.id;
        try{
            const task = await TaskModel.findOneAndDelete({_id, owner: req.user._id}, req.body);
            if(!task){
                res.status(404).send("Task not found!")
            }
            res.status(202).send(task)
        }catch(error){
            console.log(error);
            res.status(500).send(error)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

router.post('/task', authMiddleware, async (req, res) => {
    if(req.body){
        try{
            const task = await TaskModel.create({
                ...req.body,
                owner: req.user._id
            })
            // const taskObj = new TaskModel(req.body);
            // await task.save();
            res.status(201).send({message: "Task created", data: task._id})
        }catch(err){
            res.status(400).send(err)
        }
    }else{
        res.send("Request body cannot be empty!")
    }
})

module.exports = router