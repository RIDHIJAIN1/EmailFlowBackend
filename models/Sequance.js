const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const sequanceSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['mail', 'wait'],
      required: [true, 'Type is required'],
    },
    selected_id: {
      type: Schema.Types.ObjectId,
      refPath: 'refPath', // Dynamically set the reference model based on the `type` field
      required: [true, 'Selected ID is required'],
      validate: {
        validator: async function (value) {
          if (!value) return true; // Skip validation if no value is provided (handled by `required`)
          
          const modelName = this.type === 'mail' ? 'Mail' : this.type === 'wait' ? 'Wait' : null;
          if (!modelName) {
            throw new Error('Invalid type specified for dynamic reference');
          }

          const Model = mongoose.model(modelName);
          const exists = await Model.findById(value);
          if (!exists) {
            throw new Error(`No document found in ${modelName} with the provided ID`);
          }
          return true;
        },
      },
    },
    next_sequance_id: {
      type: Schema.Types.ObjectId,
      ref: 'Sequance',
      validate: {
        async validator(value) {
          if (!value) return true; // Skip validation if no value is provided
          const sequance = await mongoose.model('Sequance').findById(value);
          if (!sequance) {
            throw new Error('Sequance with the provided ID does not exist');
          }
        },
      },
    },
  },
  { timestamps: true }
);

// Define a virtual field `refPath` to set the reference model dynamically
sequanceSchema.virtual('refPath').get(function () {
  if (this.type === 'mail') return 'Mail';
  if (this.type === 'wait') return 'Wait';
  return null; // Default to null if type is not recognized
});

// Add pagination plugin
sequanceSchema.plugin(aggregatePaginate);

const Sequance = mongoose.model('Sequance', sequanceSchema);
module.exports = Sequance;