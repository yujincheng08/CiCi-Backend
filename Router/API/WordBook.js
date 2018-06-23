import {Router as ExpressRouter} from 'express';
import Auth from "Config/Auth";
import WordBookModel from 'models/WordBook';

class WordBook extends ExpressRouter {
  static PAGE_SIZE = 50;
  constructor() {
    super();
    this.get('/', Auth.optional, WordBook.getAllWordBook);
    this.get('/:wordbook/:page', Auth.optional, WordBook.getWordBook);
  }

  static getWordBook(req, res, next) {
    let {wordbook: name, page} = req.params;
    WordBookModel.findOne({name}, {
      words: {
        '$slice': [ (page-1) * WordBook.PAGE_SIZE, WordBook.PAGE_SIZE ]
      }})
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