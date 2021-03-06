import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator: async function (email) {
        const user = await this.constructor.findOne({ email });
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: 'The specified email address is already in use.',
    },
    required: [true, 'User email required.'],
    unique: true,
  },
  password: { type: String, required: true, minlength: 6, select: false },
  image: { type: String, required: true },
  places: [{ type: Types.ObjectId, required: true, ref: 'Place' }],
});

export default model('User', userSchema);
