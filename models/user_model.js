import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: String,
  password: String,
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);