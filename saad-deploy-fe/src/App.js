import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSub, setNewSub] = useState({ name: '', price: '' });
  const [editSub, setEditSub] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/v1/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleAdd = async () => {
    if (!newSub.name || !newSub.price) {
      setMessage('Please enter both name and price.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/subscriptions', newSub);
      setSubscriptions([...subscriptions, response.data]);
      setNewSub({ name: '', price: '' });
      setMessage('Subscription added successfully!');
    } catch (error) {
      console.error('Error adding subscription:', error);
      setMessage('Failed to add subscription.');
    }
  };

  const handleEdit = (sub) => {
    setEditSub(sub);
  };

  const handleUpdate = async () => {
    if (!editSub.name || !editSub.price) {
      setMessage('Please enter both name and price.');
      return;
    }

    try {
      const response = await axios.put(`/api/v1/subscriptions/${editSub.id}`, editSub);
      setSubscriptions(
        subscriptions.map(sub => (sub.id === editSub.id ? response.data : sub))
      );
      setEditSub(null);
      setMessage('Subscription updated successfully!');
    } catch (error) {
      console.error('Error updating subscription:', error);
      setMessage('Failed to update subscription.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/subscriptions/${id}`);
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      setMessage('Subscription deleted successfully!');
    } catch (error) {
      console.error('Error deleting subscription:', error);
      setMessage('Failed to delete subscription.');
    }
  };

  const total = subscriptions.reduce((acc, sub) => acc + sub.price, 0);

  return (
    <div className="container">
      <h1>Subscription Tracker</h1>

      {message && <p className="message">{message}</p>}

      <div className="form">
        <input
          type="text"
          placeholder="Subscription Name"
          value={newSub.name}
          onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price ($)"
          value={newSub.price}
          onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
        />
        <button onClick={handleAdd}>Add Subscription</button>
      </div>

      {editSub && (
        <div className="form edit-form">
          <h2>Edit Subscription</h2>
          <input
            type="text"
            placeholder="Subscription Name"
            value={editSub.name}
            onChange={(e) => setEditSub({ ...editSub, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price ($)"
            value={editSub.price}
            onChange={(e) => setEditSub({ ...editSub, price: e.target.value })}
          />
          <button onClick={handleUpdate}>Update Subscription</button>
          <button onClick={() => setEditSub(null)} className="cancel-button">Cancel</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Subscription Name</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.name}</td>
              <td>{sub.price.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(sub)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(sub.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
          {subscriptions.length === 0 && (
            <tr>
              <td colSpan="3">No subscriptions added yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Total Monthly Cost: ${total.toFixed(2)}</h2>
    </div>
  );
}

export default App;
