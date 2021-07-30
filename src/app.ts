import { HealthCheckController, RealStateController } from './controllers';
import express from 'express';
require('dotenv').config();

const app: express.Application = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use('/', HealthCheckController);
app.use('/realState', RealStateController);

app.listen(port, () =>
  console.log(`The Web Server is Listening at http://${host}:${port}`)
);

export const App: express.Application = app;
