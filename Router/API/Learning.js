import Auth from 'Config/Auth';
import {Router as ExpressRouter} from 'express';
import LearningModel, {LEARNING_STATES} from 'models/Learning';

class Learning extends ExpressRouter {

  constructor() {
    super();
    this.get('/', Auth.required, Learning.getTodayLearning);
    this.post('/:word', Auth.optional, Learning.newLearning);
    this.get('/:word', Auth.required, Learning.getLearning);
    this.patch('/:word', Auth.required, Learning.updateLearning);
    this.put('/:word', Auth.required, Learning.finishLearning);
    this.delete('/:word', Auth.required, Learning.resetLearning);
  }

  static getLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.findOne({user, word})
      .then(({state}) => {
        if (!state) state = LEARNING_STATES.NO_LEARN;
        return res.json({word, state});
      }).catch(next);
  }

  static getTodayLearning(req, res, next) {
    // TODO
  }

  static newLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.count({user, word})
      .then(count => {
        if (count > 0)
          return res.status(409).json({
            errors: "You have already learnt this word",
          });
        let learning = new LearningModel();
        let state = LEARNING_STATES.START_LEARNING;
        learning.word = word;
        learning.user = user;
        learning.state = state;
        learning.save()
          .then(() => res.json({word, state}))
          .catch(next);
      }).catch(next);
  }

  static updateLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.findOne({user, word})
      .then(learning => {
        if (learning.state < LEARNING_STATES.FINISHED) {
          learning.state += 1;
        }
        learning.save()
          .then(() => res.json({word, state: learning.state}))
          .catch(next);
      }).catch(next);
  }

  static finishLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.findOne({user, word})
      .then(learning => {
        if (learning && learning.state < LEARNING_STATES.FINISHED)
          learning.state = LEARNING_STATES.FINISHED;
        else return res.status(409).json({
          errors: "You are not learning this word.",
        });
        learning.save()
          .then(() => res.json({word, state: learning.state}))
          .catch(next);
      }).catch(next);
  }

  static resetLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.deleteOne({user, word})
      .then(() => res.status(204).send())
      .catch(next);
  }

}

export default new Learning();