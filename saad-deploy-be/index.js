const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'Hello from Backend!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
