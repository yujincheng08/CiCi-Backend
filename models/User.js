import mongoose, {Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import {sign} from 'jsonwebtoken';
import {secret} from '../Config';
import crypto from 'crypto';


class UserSchema extends Schema {
  static schema = {
    username: {
      type: Schema.Types.String,
      required: [true, "can't be blank"],
      unique: true,
      index: true,
    },
    email: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    hash: Schema.Types.String,
    salt: Schema.Types.String,
  };

  constructor() {
    super(UserSchema.schema, {timestamps: true});
    this.plugin(uniqueValidator, {message: 'is already token.'});
    this.methods.validPassword = this.validPassword;
    this.methods.setPassword = this.setPassword;
    this.methods.generateJWT = this.generateJWT;
    this.methods.toAuthJSON = this.toAuthJSON;
  }

  static getHash(salt, string) {
    return crypto.pbkdf2Sync(string, salt, 10000, 512, 'sha512').toString('hex');
  }

  validPassword(password) {
    return this.hash === UserSchema.getHash(this.salt, password);
  }

  setPassword(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = UserSchema.getHash(this.salt, password);
  }

  generateJWT() {
    let today = new Date();
    return sign({
      id: this._id,
      username: this.username,
      exp: Math.floor(new Date().setDate(today.getDate() + 60) / 100),
    }, secret);
  }

  toAuthJSON() {
    return {
      username: this.username,
      email: this.email,
      token: this.generateJWT(),
    }
  }

}

export default mongoose.model('User', new UserSchema());

