const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const mappingSchema = new Schema({
    list_id: {
        type: Schema.Types.ObjectId,
        ref: 'List',
        required: [true, 'List is required'],
        validate: {
            async validator(value) {
                const listExists = await mongoose.model("List").exists({ _id: value });
                return listExists; // Validation passes if user exists
              
            },
            message: 'Invalid list_id value'
        }
    },
    variable_name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [1, 'Name length must be between 1 and 255 characters'],
        maxlength: [255, 'Name length must be between 1 and 255 characters']
    },
    column_index: {
        type: Number,
        required: [true, 'Column index is required'],
    },
}, { timestamps: true });
 mappingSchema.plugin(aggregatePaginate)
const Mapping = mongoose.model('Mapping', mappingSchema);   
module.exports = Mapping;