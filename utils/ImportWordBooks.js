import WordBook from 'models/WordBook';
import mongoose from 'mongoose';
import {mongodb} from "Config";
import wordbooks from 'utils/wordbooks.json';

mongoose.connect(mongodb).then(() => {
  let promises = [];
  for (let wordbook of wordbooks) {
    let book = new WordBook();
    let uniqueWords = wordbook.words.filter( (value, index, self) => self.indexOf(value) === index );
    book.name = wordbook.name;
    book.words = uniqueWords;
    book.length = uniqueWords.length;

    console.log(`Importing ${wordbook.name}`);
    promises.push(book.save().then(() => {
      console.log(`Successfully import ${wordbook.name} with ${uniqueWords.length} words`);
    }).catch(console.error));
  }
  Promise.all(promises)
    .then(() => {
      console.log("Import successfully");
    }).catch(console.error)
    .finally(() => {
      mongoose.connection.close()
        .then(() => console.log("Finished"))
        .catch(console.error);
    })
}).catch(console.error);
