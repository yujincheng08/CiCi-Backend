import Auth from 'Config/Auth';
import Passport from 'Config/Passport';
import {Router as ExpressRouter} from 'express';
import User from "../../models/User";

class Session extends ExpressRouter {

  constructor() {
    super();
    this.post('/', Auth.optional, Session.login);
    this.get('/', Auth.required, Session.currentUser);
    this.delete('/', Auth.required, Session.logout);
  }

  static login(req, res, next) {
    if(!req.body.user) {
      return res.stat(433).json({
        errors: {
          user : "cannot be blank",
        }
      });
    }
    const {email, password} = req.body.user;
    if (!email) {
      return res.status(422).json({
        errors: {
          email: "cannot be blank",
        },
      });
    }
    if (!password) {
      return res.status(422).json({
        errors: {
          password: "cannot be blank",
        }
      });
    }
    Passport.authenticate((err, user, info) => {
      if (err) {
        return next(err);
      }

      if (user) {
        user.token = user.generateJWT();
        return res.json({user: user.toAuthJSON()});
      } else {
        return res.status(422).json(info);
      }
    })(req, res, next);
  }

  static logout(req, res, next) {}

  static currentUser(req, res, next) {
    User.findById(req.user.id).then((user) => {
      if (!user)
        return res.sendStatus(401);
      return res.json({user: user.toAuthJSON()});
    }).catch(next);
  }
}

export default new Session();