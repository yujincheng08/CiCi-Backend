import {secret, mongodb} from 'Config';
import Router from 'Router';
import Express from 'express';
import session from 'express-session';
import cors from 'cors';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {port} from 'Config';

class App extends Express {

  constructor() {
    super();
    this.use(cors());
    this.use(methodOverride());
    this.use(bodyParser.urlencoded({extended: false}));
    this.use(bodyParser.json());
    this.use(session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
    }));


    this.use(Router);

    mongoose.connect(mongodb).then(() => {
      this.listen(port, this.listening);
    }).catch(console.error);
  }

  listening = () => {
    console.log(`listening on ${port}`)
  };

}

new App();
