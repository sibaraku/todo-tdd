const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const app = express();
const mongodb = require('./mongodb/mongodb.connect');

mongodb.connect();

app.use(express.json());
app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('express test');
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
});

//app.listen(3015, () => {
//     console.log('Server is running on http://localhost:3015');
//});

module.exports = app;