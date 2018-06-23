import mongoose, {Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class WordBookSchema extends Schema {
  static schema = {
    name: {
      type: String,
      require: [true, "can't be blank"],
      match: [/\S+/, 'is invalid'],
      unique: true,
      index: true,
    },
    words: {type: Array},
    length: {type: Number},
  };

  constructor() {
    super(WordBookSchema.schema, {timestamps: true});
    this.plugin(uniqueValidator, {message: 'is already token.'});
  }
}

export default mongoose.model('WordBook', new WordBookSchema());