import mongoose, {Schema} from 'mongoose';


class TaskSchema extends Schema {

  static schema = {
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    words: {type: Object},
    date: {type: Date}
  };

  constructor() {
    super(TaskSchema.schema);
  }
}

export default mongoose.model('Task', new TaskSchema());