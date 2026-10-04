const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
