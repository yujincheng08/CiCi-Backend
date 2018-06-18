import {Router as ExpressRouter} from 'express';
import fetch from 'node-fetch';

class Word extends ExpressRouter {
  constructor() {
    super();
    this.get('/:word', Word.query);
  }

  static query(req, res, next) {
    const word = req.params.word;
    fetch(`http://xtk.azurewebsites.net/BingDictService.aspx?Word=${word}`)
      .then(response =>{
        return response.json();
      })
      .then(json => {
        res.json(json);
      }).catch(next);
  }
}

export default new Word();