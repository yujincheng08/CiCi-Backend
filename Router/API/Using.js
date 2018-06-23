import {Router as ExpressRouter} from 'express';
import Auth from "Config/Auth";
import UsingModel from 'models/Using';
import WordBookModel from 'models/WordBook';

class Using extends ExpressRouter {
  constructor() {
    super();
    this.get('/:wordbook', Auth.required, Using.getUsing);
    this.post('/:wordbook', Auth.required, Using.newUsing);
    this.delete('/:wordbook', Auth.required, Using.noUsing);
  }

  static getUsing(req, res, next) {
    let user = req.user.id;
    let {wordbook: name} = req.params;
    WordBookModel.findOne({name})
      .then((book) => {
        if(!book)
          return res.status(404).json({
            errors:{wordbook:'Not found'}
          });
        let {_id: wordbook} = book;
        UsingModel.count({wordbook, user})
          .then(count => {
            if (count > 0)
              res.json({state: 1});
            else
              res.json({state: 0});
          }).catch(next)
      }).catch(next);
  }

  static newUsing(req, res, next) {
    let user = req.user.id;
    let {wordbook: name} = req.params;
    WordBookModel.findOne({name})
      .then(book => {
        if(!book)
          return res.status(404).json({
            errors:{
              wordbook: "Not found"
            }
          });
        let{_id: wordbook} = book;
        let using = new UsingModel({wordbook, user});
        using.save().then(()=>res.json({name, state: 1}))
          .catch(next);
      }).catch(next)
  }

  static noUsing(req, res, next) {
    let user = req.user.id;
    let {wordbook: name} = req.params;
    WordBookModel.findOne({name})
      .then(book => {
        if(!book)
          return res.status(404).json({
            errors: {
              wordbook: "Not found"
            }
          });
        let{_id: wordbook} = book;
        UsingModel.deleteOne({wordbook, user})
          .then(()=>res.sendStatus(204))
          .catch(next);
      }).catch(next)
  }


}

export default new Using();