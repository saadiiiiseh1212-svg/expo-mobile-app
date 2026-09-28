// src/components/MenuItemCard.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const MenuItemCard = ({ item, onAddToCart, onToggleFavorite, isFavorite }) => {
  // Console log to check re-renders for Q8 performance optimization
  console.log(`Rendering MenuItemCard: ${item.name}`);

  return (
    <View style={[styles.card, !item.isAvailable && styles.disabledCard]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
            <Text style={{ fontSize: 18 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>Rs. {item.price}</Text>
        
        {item.isSpecial && <Text style={styles.specialBadge}>⭐ Daily Special</Text>}
        
        <TouchableOpacity 
          style={[styles.addBtn, !item.isAvailable && { backgroundColor: '#ccc' }]}
          disabled={!item.isAvailable}
          onPress={() => onAddToCart(item)}
        >
          <Text style={styles.addBtnText}>{item.isAvailable ? 'Add to Cart' : 'Unavailable'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// React.memo to prevent unnecessary re-renders
export default React.memo(MenuItemCard);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, overflow: 'hidden', padding: 10, elevation: 2 },
  disabledCard: { opacity: 0.5 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: 'bold' },
  desc: { fontSize: 12, color: '#666', marginVertical: 2 },
  price: { fontSize: 14, fontWeight: '600', color: '#2e7d32' },
  specialBadge: { fontSize: 10, color: '#d32f2f', fontWeight: 'bold', marginTop: 2 },
  addBtn: { backgroundColor: '#007AFF', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6 },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});