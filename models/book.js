const {model,Schema,SchemaTypes} = require("mongoose")
const mongoose = require("mongoose")

const schema = new Schema({
    name:{ 
        type: SchemaTypes.String,
        unique:true,
        required:[true, "please enter the name"],
        maxlength:50
    },
    quantity:{
        type:SchemaTypes.Number,
        required:[true, "please enter the quantity of books available"]
    },
    /*users:{
        type: [mongoose.Schema.ObjectId],
        ref: 'users'
    }*/
})

module.exports = model("books",schema)