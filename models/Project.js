const mongoose = require("mongoose");
const { Schema } = mongoose;
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const projectSchema = new Schema(
  {
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
      required: [true, "Name is required"],
      minlength: [1, "Name length must be between 1 and 255 characters"],
      maxlength: [255, "Name length must be between 1 and 255 characters"],
    },
    sequence: {
      type: Object,
      required: false, // Make it optional if needed
      validate: {
        validator(value) {
          // Custom validation for sequence object
          if (!value || typeof value !== 'object') return false;

          const { lists, sequences } = value;

          // Validate `lists`
          if (!Array.isArray(lists) || !lists.every((id) => typeof id === 'string')) {
            return false;
          }

          // Validate `sequences`
          if (!Array.isArray(sequences)) return false;

          // Check each sequence for valid structure
          return sequences.every((seq) => {
            if (seq.type === 'mail') {
              // Validate mail sequence (specific fields expected for 'mail' type)
              return typeof seq.id === 'string' && seq.type === 'mail';
            } else if (seq.type === 'wait') {
              // Validate wait sequence (check for 'waitFor' and 'waitType' properties)
              return (
                typeof seq.waitFor === 'string' &&
                typeof seq.waitType === 'string' &&
                seq.type === 'wait'
              );
            } else {
              // Allow other sequence types with arbitrary structure
              // If you want to allow other types like 'sms', 'push', etc., you can extend this logic
              return true; // Custom sequence type is allowed
            }
          });
        },
        message: 'Invalid sequence data structure',
      },
    },
  },
  { timestamps: true }
);

projectSchema.plugin(aggregatePaginate);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
