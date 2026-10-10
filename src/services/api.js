// src/services/api.js
const API_URL = 'http://192.168.100.171:5000';

export async function placeOrder(order) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Order place nahi hua');
  return res.json();
}

export async function placeDummyOrder() {
  return placeOrder({
    customerName: 'Test Customer',
    items: [
      { itemId: '1', name: 'Crispy Chicken Burger', price: 550, quantity: 2 },
      { itemId: '3', name: 'Garlic Mayo Fries', price: 250, quantity: 1 },
    ],
    totalAmount: 550 * 2 + 250,
  });
}