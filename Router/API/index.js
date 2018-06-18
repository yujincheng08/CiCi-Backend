import {Router as ExpressRouter} from 'express';
import Users from 'Router/API/Users';
import Session from 'Router/API/Session';
import Word from 'Router/API/Word';

class API extends ExpressRouter {
  constructor() {
    super();
    this.use('/user', Users);
    this.use('/session', Session);
    this.use('/word', Word);
    this.use(API.handleValidationError);
  }

  static handleValidationError(err, req, res, next) {
    if (err.name === 'ValidationError') {
      return res.status(422).json({
        error: Object.keys(err.errors).reduce((errors, key) => {
          errors[key] = err.errors[key].message;
          return errors;
        }, {}),
      });
    }
    return next(err);
  }
}

export default new API();
