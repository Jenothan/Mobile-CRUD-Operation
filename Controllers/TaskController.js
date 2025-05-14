const taskModel = require("../Models/TaskModel");                       //import TaskModel
const mongoose = require('mongoose');

const createTask = async (req, res) => {                                // creating async function
    const {title, description} = req.body;                              // destructure title and description from body

    try{                                                                
        const task = await taskModel.create({title, description});      // creating new task using taskModel
        res.status(200).json(task);                                     //response and results in json format

    } catch (e) {                                                       // catch error
        res.status(400).json({error: e.message });                      // response and send error message in json format
    }
};

// to get all tasks
const getTasks =  async(req, res) => {
    try {
        const tasks = await taskModel.find({});                         //create a variable and hold all database records
        res.status(200).json(tasks);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}

//to get single task
const getSingleTask = async (req, res) => {
    const {id} = req.params                                             //getting id from request path
    if (!mongoose.Types.ObjectId.isValid(id)){                          //validation of id
        return res.status(404).json({error: 'Task not found'});       //response for not valid id
    }
    try {
        const singleTask = await taskModel.findById(id);                //using id for find tasks 
        res.status(200).json(singleTask);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}

const updateTask = async (req, res) => {
    const {id} = req.params                                             //getting id from request path
    if (!mongoose.Types.ObjectId.isValid(id)){                          //validation of id
        return res.status(404).json({error: 'Task not found'});
    }
    try {
        const task = await taskModel.findByIdAndUpdate(                 
            {
                _id:id,                                                 //which id want to update
            },
            {
                ...req.body,                                            //used to update data from user request body
            }
        );
        res.status(200).json(task);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}

const deleteTask = async (req, res) => {
    const {id} = req.params                                             //extract id from request path
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: e.message});
    }
    try {
        const task = await taskModel.findByIdAndDelete(id);             // find task by id and delete same task
        res.status(200).json(task);
    }
    catch (e) {
        res.status(400).json({error: e.message});
    }
}

module.exports = 
    {
        createTask,
        getTasks,
        getSingleTask, 
        updateTask, 
        deleteTask 
    };                                          // export functions