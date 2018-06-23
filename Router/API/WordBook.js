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
      .then((book) => {
        if(!book)
          return res.status(404).json({
            errors:{
              wordbook: 'Not found',
            }
          });
        res.json(book.words);
      })
      .catch(next);
  }

  static getAllWordBook(req, res, next) {
    WordBookModel.find({}, {_id: false, name: true, length: true})
      .then(books => {
        res.json(books.reduce((books, book)=>{
          books[book.name]= {length: book.length};
          return books
        }, {}));
    }).catch(next);
  }
}

export default new WordBook();