const mongoose = require('mongoose')
require("../db/mongoose")
const constants = require("../json/constants.json")
const validatorObj = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const TaskModel = require("./task")
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        age: {
            type: Number,
            default: 18,
            min: 18,
            validate(value) {
                if (value < 1) {
                    throw new Error("Age must be > 0.")
                }
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (value) {
                    if (!validatorObj.isEmail(value)) {
                        throw new Error("Invalid email format.")
                    }
                } else {
                    throw new Error("Email is required")
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 6,
            validate(value) {
                if (value) {
                    if (value.toLowerCase().includes('password')) {
                        throw new Error("Passowrd should not contain 'password' as string")
                    }
                }
            }
        },
        avatar: {
            type: Buffer
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },
    {
        timestamps: true
    }
)

userSchema.virtual('tasks', {
    ref: "Tasks",
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const userData = this
    if (!userData) {
        throw new Error("Something went wrong.")
    }

    const token = jwt.sign(
        { 
            _id: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            age: userData.age 
        },
        constants.JWT_SECRET_KEY,
        { expiresIn: "30 minutes" }
    )
    if (!userData.tokens) {
        userData.tokens = [];
    }
    userData.tokens = userData.tokens.concat({ token })
    await userData.save()
    return token;
}

userSchema.methods.toJSON = function () {  //userSchema.methods.getPublicProfile = function () { for manual mode
    const userData = this
    const user = userData.toObject()

    delete user.password
    delete user.tokens

    return user
}


userSchema.statics.findByCredentials = async (email, password) => {
    const usr = await UserModel.findOne({ email })
    if (!usr) {
        throw new Error("Invalid email or passowrd")
    }

    const match = await bcrypt.compare(password, usr.password)
    if (!match) {
        throw new Error("Invalid email or passowrd")
    }

    return usr;
}

// Excrypt password before creating new user
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        console.log(await bcrypt.hash(user.password, 8));
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// Delete tasks before deleting user
userSchema.pre('remove', async function (next) {
    const user = this

    await TaskModel.deleteMany({owner: user._id})
    next();
})

const UserModel = mongoose.model("Users", userSchema)

module.exports = UserModel;