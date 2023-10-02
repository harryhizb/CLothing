/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
import express from 'express';
import cors from 'cors';
import status from 'http-status';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import dbConnection from './Connection/dbConnect';
import Router from './Routes/Router';
import errorHandler from './Middlewares/errorHandler';
import verifyToken from './Middlewares/verifyToken';

dbConnection();

const app = express();

// initialize passport
app.use(passport.initialize());
app.use(
	session({
	  secret: 'c96b167b81bfd75751498f924f4ede26f8d251c6a00c31552a4d8cfbf2a6e072e8d92b92eb8e4908752777bb902c1f5df45c968f6adef6ceb9682493b635c4af', // Replace with your actual secret key
	  resave: false,
	  saveUninitialized: true,
	})
  );

// will decode token from each request in {req.user}
app.use(verifyToken.verifyTokenSetUser);

app.use(express.json());

app.get('/', (req, res) => {
	res.status(status.OK).send({ Message: 'Connected', status: status.OK });
});

app.use('/signup', Router.SignupRouter);

app.use('/signin', Router.SigninRouter);

app.use('/cloth', Router.EventRouter);

// i have implemented it in signup controller like this {next(new Error('Image is required'))}
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () =>
	console.log(`App listening On port http://localhost:${port}`),
);
