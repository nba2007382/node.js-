'use strict';
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    status: Number,
    create_time: String,
})


const Admin = mongoose.model('Admin', adminSchema);


module.exports = Admin