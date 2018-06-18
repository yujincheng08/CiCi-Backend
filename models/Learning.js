import mongoose, {Schema} from 'mongoose';

class LearningSchema extends Schema {
  static schema = {
    word: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    state: {type: Number, default: 0}
  };

  constructor() {
    super(LearningSchema.schema, {timestamp: true});
  }
}

export default mongoose.model('Learning', new LearningSchema());