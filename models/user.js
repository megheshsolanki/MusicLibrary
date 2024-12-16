const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin','editor', 'viewer'],
        required: true
    },
    admin_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: function(){
            return this.role != "admin"
        }
    }
},{timestamps : {createdAt: true, updatedAt: false}});

module.exports = mongoose.model("User", userSchema);