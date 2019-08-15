import './common/env';
import Express from 'express';

import routes from './routes';
import * as bodyParser from 'body-parser';
import * as os from 'os';
import l from './common/logger';
import errorHandler from './api/middlewares/error.handler';

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./server/common/api.yaml');

const app = new Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routes(app);

const port = process.env.PORT;

app.listen(port, () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`));
