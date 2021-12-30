require("../src/db/mongoose")
const UserModel = require("../src/models/user")

// userId = 61c2abf1389214b3904d8ce2

// UserModel.findByIdAndUpdate('61c2abf1389214b3904d8ce2', {age: 22}).then((user) => {
//     console.log(user);
//     return UserModel.countDocuments({age: 22})
// }).then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })


const updateAgrAndGetCount = async (id, age) => {
    const user = await UserModel.findByIdAndUpdate(id, {age});
    console.log(user);

    const count = await UserModel.countDocuments({age});

    return count;
}

updateAgrAndGetCount('61c2abf1389214b3904d8ce2', 23).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})