import Auth from 'Config/Auth';
import {Router as ExpressRouter} from 'express';
import User from 'models/User';

class Users extends ExpressRouter {
  constructor() {
    super();
    this.get('/', Auth.required, Users.getUser);
    this.post('/', Users.register);
    this.patch('/profile',Auth.required, Users.modify);
    this.get('/profile',Auth.required, Users.profile);
  }

  static getUser(req, res, next) {
    User.findById(req.user.id).then((user) => {
      if (!user)
        return res.status(401).json({
          errors: {
            user: 'Unauthorized',
          }
        });
      return res.json({user: user.toAuthJSON()});
    }).catch(next);
  }

  static register(req, res, next) {
    let user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(() => {
      return res.json({user: user.toAuthJSON()});
    }).catch(next);
  }

  static modify() {
    //TODO:
  }

  static profile() {
    //TODO:
  }
}

export default new Users();