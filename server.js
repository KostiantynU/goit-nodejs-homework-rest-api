const app = require('./app');
const mongoose = require('mongoose');

const DB_HOST =
  'mongodb+srv://kostiantyn:AgAinNewPass@learningcluster.jftkfqm.mongodb.net/?retryWrites=true&w=majority';
mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(3000, () => {
      console.log(
        'If you see this message - it means MongoDB is conected. Server running. Use our API on port: 3000'
      );
    })
  )
  .catch(error => console.log(error.message));
