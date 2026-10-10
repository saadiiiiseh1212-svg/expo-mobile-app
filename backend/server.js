const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- MongoDB connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

// ---------- Order model ----------
const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, default: 'Guest' },
    items: [
      {
        itemId: String,
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);
const Order = mongoose.model('Order', orderSchema);

// ---------- Routes ----------
app.get('/', (req, res) => res.send('Restaurant API is running'));

// Order place karo
app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Saare orders dekho
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

const PORT = process.env.PORT || 5000;
// '0.0.0.0' zaroori hai taake phone same WiFi se server tak pohanch sake
app.listen(PORT, '0.0.0.0', () => console.log('🚀 Server running on port ' + PORT));