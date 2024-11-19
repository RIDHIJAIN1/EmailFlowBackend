const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const listSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        validate: {
          async validator(value) {
            // Check if the user exists in the "User" collection
            const userExists = await mongoose.model("User").exists({ _id: value });
            return userExists; // Validation passes if user exists
          },
          message: "Invalid user_id value",
        },
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [1, 'Name length must be between 1 and 255 characters'],
        maxlength: [255, 'Name length must be between 1 and 255 characters']
    },
    file_data: {
        type: Schema.Types.Mixed, // Allows for JSON data to be stored
        required: [true, 'File data is required'],
      },
}, { timestamps: true });
 listSchema.plugin(aggregatePaginate)
const List = mongoose.model('List', listSchema);   
module.exports = List;