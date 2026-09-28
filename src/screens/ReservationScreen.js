// src/screens/ReservationScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useReservation } from '../hooks/useReservation';
import { useTheme } from '../context/ThemeContext';

const timeSlots = ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

export default function ReservationScreen() {
  const { 
    reservations, selectedDate, setSelectedDate, 
    selectedTime, setSelectedTime, partySize, setPartySize, 
    createReservation, cancelReservation 
  } = useReservation();
  
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleBooking = () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill in all contact details.');
      return;
    }

    const result = createReservation({
      date: selectedDate,
      time: selectedTime,
      partySize: Number(partySize),
      contact: { name, phone }
    });

    if (result.success) {
      Alert.alert('Success', result.message);
      setName('');
      setPhone('');
    } else {
      Alert.alert('Booking Failed', result.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Table Reservation</Text>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.label, { color: colors.text }]}>Party Size (1 - 12):</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.subText }]}
          keyboardType="numeric"
          value={String(partySize)}
          onChangeText={(val) => setPartySize(Number(val))}
        />

        <Text style={[styles.label, { color: colors.text }]}>Date (YYYY-MM-DD):</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.subText }]}
          value={selectedDate}
          onChangeText={setSelectedDate}
        />

        <Text style={[styles.label, { color: colors.text }]}>Select Time Slot:</Text>
        <View style={styles.slotContainer}>
          {timeSlots.map((slot) => {
            const isDisabled = slot === '15:00'; // Example rule: 15:00 disabled for demo
            return (
              <TouchableOpacity
                key={slot}
                disabled={isDisabled}
                style={[
                  styles.slotBtn,
                  selectedTime === slot && styles.selectedSlot,
                  isDisabled && styles.disabledSlot
                ]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.slotText, isDisabled && { color: '#999' }]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Your Name:</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.subText }]}
          placeholder="Full Name"
          placeholderTextColor={colors.subText}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: colors.text }]}>Phone (Format: 03XX-XXXXXXX):</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.subText }]}
          placeholder="0312-3456789"
          placeholderTextColor={colors.subText}
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
          <Text style={styles.bookBtnText}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: colors.text }]}>My Reservations</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.resCard, { backgroundColor: colors.cardBackground }]}>
            <View>
              <Text style={[styles.resText, { color: colors.text }]}>{item.table} | {item.date} at {item.time}</Text>
              <Text style={{ color: colors.subText, fontSize: 12 }}>Party: {item.partySize} | {item.contact.name} ({item.contact.phone})</Text>
            </View>
            <TouchableOpacity onPress={() => cancelReservation(item.id)}>
              <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  card: { padding: 15, borderRadius: 8, elevation: 2, marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, height: 38, fontSize: 13, marginBottom: 6 },
  slotContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  slotBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#e0e0e0', borderRadius: 4 },
  selectedSlot: { backgroundColor: '#007AFF' },
  disabledSlot: { backgroundColor: '#d0d0d0', opacity: 0.5 },
  slotText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  bookBtn: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 12 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  resCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 6, marginBottom: 8, elevation: 1 }
});