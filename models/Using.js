import mongoose, {Schema} from 'mongoose';

class UsingSchema extends Schema {
  static schema = {
    wordbook: {type: Schema.Types.ObjectId, ref: 'WordBook'},
    user: {type: Schema.Types.ObjectId, ref:'User'},
  };

  constructor() {
    super(UsingSchema.schema, {timestamps: true});
  }
}

export default mongoose.model('Using', new UsingSchema());