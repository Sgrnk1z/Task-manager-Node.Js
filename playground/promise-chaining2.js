require("../src/db/mongoose")
const TaskModel = require("../src/models/task")

// taskId = 61c30b1eacf715ac4ba6448c

// TaskModel.findByIdAndDelete('61c30b1eacf715ac4ba6448c').then((task) => {
//     console.log(task);
//     return TaskModel.countDocuments({completed: false});
// }).then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })

const deleteTaskAndGetCount = async (id, status) => {
    const task = await TaskModel.findByIdAndDelete(id);
    console.log(task);

    return await TaskModel.countDocuments({ completed: status });
}

deleteTaskAndGetCount('61c30b1eacf715ac4ba6448c', false).then(
    (count) => console.log(count)
).catch(
    (err) => console.log(err)
)