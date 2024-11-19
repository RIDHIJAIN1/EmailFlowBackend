// models/User.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
    minlength: [1, 'Name length must be between 1 and 255 characters'],
    maxlength: [255, 'Name length must be between 1 and 255 characters']
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty'],
    unique: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: 'Invalid email format'
    },
    minlength: [1, 'Email length must be between 1 and 255 characters'],
    maxlength: [255, 'Email length must be between 1 and 255 characters']
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty'],
    select: true,
  },
}, { timestamps: true });
userSchema.plugin(aggregatePaginate)
const User = mongoose.model('User', userSchema);

module.exports = User;