import Auth from 'Config/Auth';
import {Router as ExpressRouter} from 'express';
import LearningModel from 'models/Learning';
import mongoose from "mongoose";

class Examine extends ExpressRouter {

  static TEST_SIZE = 30;

  constructor() {
    super();
    this.get('/:size*?', Auth.required, Examine.newExamine);
  }

  static newExamine(req, res, next) {
    let size = Number(req.params.size) || Examine.TEST_SIZE;
    let user = mongoose.Types.ObjectId(req.user.id);
    LearningModel.count({user})
      .then(count => {
        if (count < size)
          return res.status(403).json({errors: {size: "You have to learn more words"}});
        LearningModel.aggregate([
          {'$match': {user}},
          {'$sample': {size}}
        ]).then(samples => {
          res.json(samples.map(sample=>sample.word));
        }).catch(next)
      }).catch(next);
  }
}

export default new Examine();