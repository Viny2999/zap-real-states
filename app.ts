import express, { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';

const app: express.Application = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(cors());

app.use('/');

app.listen(port, () =>
  console.log(`The Web Server is Listening at http://${host}:${port}`)
);

export const App: express.Application = app;