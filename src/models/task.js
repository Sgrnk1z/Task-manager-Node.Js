const mongoose = require('mongoose')

require("../db/mongoose")

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            trim: true,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Users'
        }
    },
    {
        timestamps: true
    }
)

// Defining a model...
const TaskModel = mongoose.model("Tasks", taskSchema)

module.exports = TaskModel