const express = require("express")
const hbs = require("hbs")
const path = require('path');
require("./db/mongoose")
const UserRouter = require("../src/routers/user.router")
const TaskRouter = require("../src/routers/task.router")

const app = express()
const port = process.env.PORT || 5001

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, './templates'))


// // Middleware
// app.use((req, res, next) => {
//     res.status(503).send("Site under maintainence....")
//     next();
// })

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.get('*', (req, res)=>{
    res.render('404')
})

app.listen(port, () => {
    console.log("Server is up on port: "+port);
})