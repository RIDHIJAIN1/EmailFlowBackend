const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const waitSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['day', 'hour', 'minute'],
      required: [true, 'Type is required'],
    },
    
    value: {
      type: Number,
      required: [true, 'Value is required'],
    },

  },
  { timestamps: true }
);


// Add pagination plugin
waitSchema.plugin(aggregatePaginate);

const Wait = mongoose.model('Wait', waitSchema);
module.exports = Wait;