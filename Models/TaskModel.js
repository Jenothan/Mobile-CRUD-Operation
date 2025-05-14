const mongoose = require('mongoose');                                       //import mongoose

const Schema = mongoose.Schema;                                             //assigning schema class to a new variable Schema

const TaskSchema = new Schema(                                              // create new variable 
    {
        title: {                                                            // new field 
            type: String,                                                   // field type
            require: true,                                                  // defining field as necessary
        },

        description: {
            type: String,
        },
    },
    { timestamps: true }                                                    // automatically add data created time and last updated time
);

module.exports = mongoose.model("Task", TaskSchema);                        // export Task model 


 