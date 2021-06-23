import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  author: { type: String, required: true },
  journals: [{
    title: String,
    content: String,
    date: Date,
  }],
});

export default mongoose.model('Journal', userSchema);