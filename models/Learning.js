import mongoose, {Schema} from 'mongoose';
import {LEARNING_STATES} from "Config";


class LearningSchema extends Schema {

  static schema = {
    word: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    state: {type: Number, default: LEARNING_STATES.START_LEARNING},
    learnDay: {type: Schema.Types.Date}
  };

  constructor() {
    super(LearningSchema.schema, {timestamps: true});
  }
}

export default mongoose.model('Learning', new LearningSchema());