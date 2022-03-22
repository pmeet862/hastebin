const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  password: {
    type: String,

    trim: true,
  },
});

module.exports = mongoose.model("document", documentSchema);
