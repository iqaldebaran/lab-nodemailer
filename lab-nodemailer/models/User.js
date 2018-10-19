const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ["PENDING-CONFIRMATION", "ACTIVE"], //Tipos de roles..pueden ser mas tipos
    default: "PENDING-CONFIRMATION"
  },
  confirmationCode: String,
  email: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;