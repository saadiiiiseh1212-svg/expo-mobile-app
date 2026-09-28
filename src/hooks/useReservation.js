// src/hooks/useReservation.js
import { useState } from 'react';

const mockTables = [
  { id: 't1', name: 'Table 1 (2 Seats)', seats: 2 },
  { id: 't2', name: 'Table 2 (4 Seats)', seats: 4 },
  { id: 't3', name: 'Table 3 (6 Seats)', seats: 6 },
  { id: 't4', name: 'Table 4 (8 Seats)', seats: 8 },
];

export const useReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [partySize, setPartySize] = useState(2);
  const [contactDetails, setContactDetails] = useState({ name: '', phone: '' });

  const createReservation = (details) => {
    // Basic validation for Pakistani phone format: 03XX-XXXXXXX
    const phoneRegex = /^03\d{2}-\d{7}$/;
    if (!phoneRegex.test(details.phone)) {
      return { success: false, message: 'Invalid phone format. Use 03XX-XXXXXXX' };
    }

    // Find a suitable table
    const table = mockTables.find(t => t.seats >= details.partySize);
    if (!table) {
      return { success: false, message: 'No table available for this party size.' };
    }

    const newReservation = {
      id: Date.now().toString(),
      date: details.date,
      time: details.time,
      partySize: details.partySize,
      table: table.name,
      contact: details.contact,
    };

    setReservations(prev => [...prev, newReservation]);
    return { success: true, message: 'Table reserved successfully!' };
  };

  const cancelReservation = (id) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  return {
    reservations,
    mockTables,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    partySize,
    setPartySize,
    contactDetails,
    setContactDetails,
    createReservation,
    cancelReservation,
  };
};