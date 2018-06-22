import mongoose, {Schema} from 'mongoose';

export const LEARNING_STATES = {
  NO_LEARN: 0,
  START_LEARNING: 1,
  // LEARNING is floating pointer number between START and FINISH.
  FINISHED: 6,
};

class LearningSchema extends Schema {

  static schema = {
    word: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    state: {type: Number, default: LEARNING_STATES.NO_LEARN}
  };

  constructor() {
    super(LearningSchema.schema, {timestamps: true});
  }
}

export default mongoose.model('Learning', new LearningSchema());