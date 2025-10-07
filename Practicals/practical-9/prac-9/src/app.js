const express = require('express');
const homeRoutes = require('./routes/homeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Use home routes
app.use('/', homeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
