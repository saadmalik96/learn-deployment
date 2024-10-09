const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// In-memory list to store subscriptions
let subscriptions = [];
let currentId = 1;

// Routes

// Get all subscriptions
app.get('/api/v1/subscriptions', (req, res) => {
  res.json(subscriptions);
});

// Add a new subscription
app.post('/api/v1/subscriptions', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }
  const newSubscription = { id: currentId++, name, price: parseFloat(price) };
  subscriptions.push(newSubscription);
  res.status(201).json(newSubscription);
});

// Update a subscription
app.put('/api/v1/subscriptions/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const subscription = subscriptions.find(sub => sub.id === parseInt(id));

  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found.' });
  }

  if (name !== undefined) subscription.name = name;
  if (price !== undefined) subscription.price = parseFloat(price);

  res.json(subscription);
});

// Delete a subscription
app.delete('/api/v1/subscriptions/:id', (req, res) => {
  const { id } = req.params;
  const index = subscriptions.findIndex(sub => sub.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Subscription not found.' });
  }

  const deleted = subscriptions.splice(index, 1);
  res.json(deleted[0]);
});

// Health check
app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'Hello from Backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
