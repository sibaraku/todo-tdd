const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const app = express();
const mongodb = require('./mongodb/mongodb.connect');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongodb.connect();

app.use(express.json());
app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
  res.send('express test');
});

module.exports = app;