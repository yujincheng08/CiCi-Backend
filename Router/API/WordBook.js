import {Router as ExpressRouter} from 'express';
import Auth from "Config/Auth";
import WordBookModel from 'models/WordBook';

class WordBook extends ExpressRouter {
  constructor() {
    super();
    this.get('/', Auth.optional, WordBook.getAllWordBook);
    this.get('/:wordbook', Auth.optional, WordBook.getWordBook);
  }

  static getWordBook(req, res, next) {
    let {wordbook: name} = req.params;
    WordBookModel.findOne({name})
      .then(({words}) => {
        res.json(words);
      })
      .catch(next);
  }

  static getAllWordBook(req, res, next) {
    WordBookModel.find({}, {name: true})
      .then(books => {
        res.json(books.map(book=>book.name));
    }).catch(next);
  }
}

export default new WordBook();