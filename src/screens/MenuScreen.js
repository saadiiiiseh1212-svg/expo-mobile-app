import React, { useState, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Image,
  Dimensions,
  Platform 
} from 'react-native';
import * as menuData from '../data/menu';
import MenuItemCard from '../components/MenuItemCard';

// Menu data kisi bhi export naam se mil jayega
const menuItems =
  menuData.menuItems ||
  menuData.mockMenu ||
  menuData.default ||
  Object.values(menuData).find(Array.isArray) ||
  [];

const { width } = Dimensions.get('window');

export default function MenuScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Delivery'); // Delivery vs Pickup

  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

  // Aaj ki date
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Advanced filtering with search and categories
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Top Header Section */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.locationLabel}>DELIVER TO</Text>
          <TouchableOpacity style={styles.locationRow}>
            <Text style={styles.locationText}>Main Boulevard, DHA Phase 5 📍</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.profileEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Switcher Tabs (Delivery / Pickup) */}
      <View style={styles.tabSwitcherContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Delivery' && styles.activeTabButton]}
          onPress={() => setActiveTab('Delivery')}
        >
          <Text style={[styles.tabText, activeTab === 'Delivery' && styles.activeTabText]}>🛵 Delivery (25 min)</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Pickup' && styles.activeTabButton]}
          onPress={() => setActiveTab('Pickup')}
        >
          <Text style={[styles.tabText, activeTab === 'Pickup' && styles.activeTabText]}>🛍️ Pickup (10 min)</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Promo Banner */}
            <View style={styles.promoCard}>
              <View style={styles.promoTextContainer}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>SPECIAL DEAL 🔥</Text>
                </View>
                <Text style={styles.promoTitle}>50% Off Your First Order!</Text>
                <Text style={styles.promoSubtitle}>Use code: <Text style={styles.codeHighlight}>WELCOME50</Text></Text>
              </View>
            </View>

            {/* Heavy Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search dishes, burgers, drinks..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearIcon}>❌</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Today's Date */}
            <Text style={styles.dateText}>{today}</Text>

            {/* Horizontal Category Chips */}
            <View style={styles.categoriesWrapper}>
              <Text style={styles.sectionHeading}>Categories</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(cat) => cat}
                renderItem={({ item }) => {
                  const isSelected = selectedCategory === item;
                  return (
                    <TouchableOpacity
                      style={[styles.categoryCard, isSelected && styles.selectedCategoryCard]}
                      onPress={() => handleSelectCategory(item)}
                    >
                      <Text style={[styles.categoryCardText, isSelected && styles.selectedCategoryCardText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionHeading}>Available Dishes</Text>
              <Text style={styles.resultsCount}>{filteredItems.length} items found</Text>
            </View>
          </>
        }
        renderItem={({ item }) => <MenuItemCard item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No matching items found</Text>
            <Text style={styles.emptySubtitle}>Try searching for something else or clear filters.</Text>
          </View>
        }
      />

      {/* Floating Bottom Cart Bar */}
      <View style={styles.bottomCartBar}>
        <View>
          <Text style={styles.cartBarSub}>Items selected in cart</Text>
          <Text style={styles.cartBarTitle}>View Full Order Summary</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('CartScreen')}
        >
          <Text style={styles.checkoutButtonText}>View Cart 🛒</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1016', // Deep modern dark/rich background
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  locationLabel: {
    fontSize: 10,
    color: '#ff6b6b',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f222a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2f333d',
  },
  profileEmoji: {
    fontSize: 18,
  },
  tabSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#1f222a',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#ff4757',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  promoCard: {
    backgroundColor: '#1a1d24',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#2a2e3d',
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: '#ff4757',
    fontSize: 10,
    fontWeight: 'bold',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 13,
    color: '#aaa',
  },
  codeHighlight: {
    color: '#2ed573',
    fontWeight: 'bold',
  },
  searchSection: {
    marginVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f222a',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#2f333d',
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  clearIcon: {
    fontSize: 12,
    padding: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  categoriesWrapper: {
    marginVertical: 15,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1f222a',
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2f333d',
    height: 42,
    justifyContent: 'center',
  },
  selectedCategoryCard: {
    backgroundColor: '#ff4757',
    borderColor: '#ff4757',
  },
  categoryCardText: {
    color: '#bbb',
    fontWeight: '600',
    fontSize: 13,
  },
  selectedCategoryCardText: {
    color: '#fff',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 12,
    color: '#777',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    color: '#777',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomCartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#191c24',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2f333d',
  },
  cartBarSub: {
    fontSize: 11,
    color: '#888',
  },
  cartBarTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#2ed573',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});