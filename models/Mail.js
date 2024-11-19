const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mailSchema = new Schema({
    // list_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'List',
    //     required: [true, 'List is required'],
    //     validate: {
    //         async validator(value) {
    //             const listExists = await mongoose.model("List").exists({ _id: value });
    //             return listExists; // Validation passes if user exists
              
    //         },
    //         message: 'Invalid list_id value'
    //     }
    // },
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
    template: {
        type: Buffer,
        required: [true, 'Template is required'],
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        minlength: [1, 'Subject length must be between 1 and 255 characters'],
        maxlength: [255, 'Subject length must be between 1 and 255 characters']
    },
}, { timestamps: true });
 mailSchema.plugin(aggregatePaginate)
const Mail = mongoose.model('Mail', mailSchema);   
module.exports = Mail;