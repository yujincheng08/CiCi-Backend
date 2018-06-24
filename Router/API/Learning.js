import Auth from 'Config/Auth';
import {Router as ExpressRouter} from 'express';
import LearningModel from 'models/Learning';
import TaskModel from 'models/Task';
import WordBookModel from 'models/WordBook';
import UsingModel from 'models/Using';
import {getDay, LEARNING_DAYS, LEARNING_STATES, TASK_NEW_WORD} from "Config";

class Learning extends ExpressRouter {

  constructor() {
    super();
    this.get('/', Auth.required, Learning.getTodayLearning);
    this.post('/:word', Auth.required, Learning.newLearning);
    this.get('/:word', Auth.required, Learning.getLearning);
    this.patch('/:word', Auth.required, Learning.updateLearning);
    this.put('/:word', Auth.required, Learning.finishLearning);
    this.delete('/:word', Auth.required, Learning.resetLearning);
    //this.post('/', Auth.required, Learning.getWords);
  }

  static getLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.findOne({user, word})
      .then(learning => {
        let state = null;
        if (!learning || !learning.state) state = LEARNING_STATES.NO_LEARN;
        else state = learning.state;
        return res.json({word, state});
      }).catch(next);
  }

  static getTodayLearning(req, res, next) {
    let user = req.user.id;
    TaskModel.findOne({user})
      .then(task => {
        if (task === null)
          task = new TaskModel({user});
        else if (task.date.getTime() === getDay())
          return res.json(task.words);

        return Learning.getWords(user)
          .then(words => {
            task['words'] = words;
            task['date'] = getDay();
            return task.save().then(() => res.json(task.words));
          });
      }).catch(next);
  }

  static newLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.count({user, word})
      .then(count => {
        if (count > 0)
          return res.status(409).json({
            errors: {[word]: "You have already learnt this word"}
          });
        let learning = new LearningModel();
        learning.word = word;
        learning.user = user;
        learning.learnDay = getDay();
        return learning.save()
          .then(() => res.json({word, state: LEARNING_STATES.START_LEARNING}));
      }).catch(next);
  }

  static updateLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.findOne({user, word})
      .then(learning => {
        if (learning.state < LEARNING_STATES.FINISHED)
          learning.state += 1;
        learning['learnDay'] = getDay();
        let promises = [];
        promises.push(learning.save());
        promises.push(TaskModel.findOne({user})
          .then(task => {
            if (task && task.words[word] === false) {
              task.words[word] = true;
              task.markModified('words');
              return task.save();
            }
          }));
        return Promise.all(promises).then(() => res.json({word, state: learning.state}));
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
          errors: {
            [word]: "You are not learning this word."
          },
        });
        learning['learnDay'] = getDay();
        let promises = [];
        promises.push(learning.save());
        promises.push(TaskModel.findOne({user})
          .then(task => {
            if (task && task.words[word] === false) {
              task.words[word] = true;
              task.markModified('words');
              return task.save();
            }
          }));
        return Promise.all(promises).then(() => res.json({word, state: learning.state}));
      }).catch(next);
  }

  static resetLearning(req, res, next) {
    let user = req.user.id;
    let word = req.params.word;
    LearningModel.deleteOne({user, word})
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  static getWords(user) {
    let words = [];
    let promises = [];
    // Get word that use is learning
    // Get specific number of words from a random word book user is using
    // expect for those is learning
    // for each state, get specific number of words
    const {START_LEARNING, FINISHED} = LEARNING_STATES;
    promises.push(
      LearningModel.count({user, state: START_LEARNING, learnDay: {$lt: getDay()}})
        .then(count => {
          if (count > 0) return;
          return LearningModel.find({user})
            .then(learnings => {
              let learningWords = learnings.map(({word}) => word);
              return UsingModel.find({user}, {_id: false, wordbook: true})
                .then(usings => {
                  let wordbooks = usings.map(using => using.wordbook);
                  return WordBookModel.aggregate([
                    {$match: {_id: {$in: wordbooks}}},
                    {$unwind: '$words'},
                    {$match: {words: {$nin: learningWords}}},
                    {$sample: {size: TASK_NEW_WORD}}
                  ]).then(newWords => {
                    newWords = newWords.map(({words}) => words);
                    for (let word of newWords)
                      promises.push(new LearningModel({word, user, learnDay: getDay()}).save());
                    words.push(...newWords);
                  });
                });
            })
        }));
    for (let state = START_LEARNING; state < FINISHED; ++state) {
      promises.push(LearningModel.find({user, state, learnDay: {$lte: getDay(LEARNING_DAYS[state])}},
        {_id: false, word: true})
        .limit(LEARNING_DAYS[state])
        .then(stateWords => words.push(...stateWords.map(({word}) => word)))
      )
    }
    return Promise.all(promises).then(() =>
      words.filter((value, index, self) => self.indexOf(value) === index)
        .reduce((total, word) => {
          total[word] = false;
          return total
        }, {}));
  }
}

export default new Learning();