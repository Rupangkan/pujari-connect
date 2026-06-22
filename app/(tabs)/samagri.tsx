/**
 * SAMAGRI Tab — Browse and shop puja samagri items
 * Ported from MyPandit's SamagriScreen.kt
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, FlatList, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Chip } from '@/components/ui/Chip';
import { SamagriItemCard } from '@/components/cards/SamagriItemCard';
import { useCartStore } from '@/store/cartStore';
import { SamagriItem } from '@/types';

const CATEGORIES = ['All', 'Flowers', 'Fruits', 'Grains', 'Vessels', 'Fragrance', 'Powders', 'Offerings', 'Accessories'];

const SAMAGRI_ITEMS: SamagriItem[] = [
  { id: '1', name: 'Fresh Marigold Flowers', description: 'Premium quality marigold flowers', category: 'Flowers', price: 150, unit: 'bunch', inStock: true },
  { id: '2', name: 'Rose Petals', description: 'Fresh red rose petals for offerings', category: 'Flowers', price: 120, unit: 'pack', inStock: true },
  { id: '3', name: 'Lotus Flowers', description: 'Sacred lotus for special pujas', category: 'Flowers', price: 200, unit: 'piece', inStock: true },
  { id: '4', name: 'Jasmine Garland', description: 'Fresh jasmine flowers garland', category: 'Flowers', price: 100, unit: 'garland', inStock: true },
  { id: '5', name: 'Fresh Coconut', description: 'Whole coconut for puja rituals', category: 'Fruits', price: 60, unit: 'piece', inStock: true },
  { id: '6', name: 'Bananas', description: 'Fresh ripe bananas for offerings', category: 'Fruits', price: 50, unit: 'dozen', inStock: true },
  { id: '7', name: 'Seasonal Fruits Pack', description: 'Assorted seasonal fruits for puja', category: 'Fruits', price: 250, unit: 'pack', inStock: true },
  { id: '8', name: 'Raw Rice', description: 'Pure white rice for rituals', category: 'Grains', price: 50, unit: 'kg', inStock: true },
  { id: '9', name: 'Black Sesame Seeds', description: 'Premium quality til for puja', category: 'Grains', price: 80, unit: '250g', inStock: true },
  { id: '10', name: 'Wheat Grains', description: 'Whole wheat for offerings', category: 'Grains', price: 40, unit: '500g', inStock: true },
  { id: '11', name: 'Brass Kalash', description: 'Traditional brass pot for puja', category: 'Vessels', price: 450, unit: 'piece', inStock: true },
  { id: '12', name: 'Copper Puja Thali', description: 'Large copper plate for aarti', category: 'Vessels', price: 350, unit: 'piece', inStock: true },
  { id: '13', name: 'Small Copper Bowls', description: 'Set of 5 small bowls for offerings', category: 'Vessels', price: 280, unit: 'set', inStock: true },
  { id: '14', name: 'Diya Stand', description: 'Brass diya stand with 5 slots', category: 'Vessels', price: 220, unit: 'piece', inStock: true },
  { id: '15', name: 'Incense Sticks', description: 'Premium agarbatti - mixed fragrance', category: 'Fragrance', price: 50, unit: 'pack', inStock: true },
  { id: '16', name: 'Camphor Tablets', description: 'Pure camphor for aarti', category: 'Fragrance', price: 30, unit: '100g', inStock: true },
  { id: '17', name: 'Sandalwood Paste', description: 'Pure sandalwood chandan paste', category: 'Fragrance', price: 120, unit: '50g', inStock: true },
  { id: '18', name: 'Dhoop Sticks', description: 'Traditional dhoop for puja', category: 'Fragrance', price: 60, unit: 'pack', inStock: true },
  { id: '19', name: 'Turmeric Powder', description: 'Pure haldi powder for rituals', category: 'Powders', price: 40, unit: '100g', inStock: true },
  { id: '20', name: 'Kumkum Sindoor', description: 'Traditional red kumkum powder', category: 'Powders', price: 30, unit: '50g', inStock: true },
  { id: '21', name: 'Vibhuti (Sacred Ash)', description: 'Holy ash for applying tilak', category: 'Powders', price: 25, unit: '50g', inStock: true },
  { id: '22', name: 'Rangoli Colors', description: 'Set of 10 vibrant rangoli colors', category: 'Powders', price: 150, unit: 'set', inStock: true },
  { id: '23', name: 'Pure Cow Ghee', description: 'Premium quality desi ghee', category: 'Offerings', price: 350, unit: '500ml', inStock: true },
  { id: '24', name: 'Mishri (Rock Sugar)', description: 'Pure rock sugar crystals', category: 'Offerings', price: 60, unit: '250g', inStock: true },
  { id: '25', name: 'Betel Leaves', description: 'Fresh paan leaves for puja', category: 'Offerings', price: 20, unit: 'bunch', inStock: true },
  { id: '26', name: 'Supari (Betel Nuts)', description: 'Whole betel nuts for offerings', category: 'Offerings', price: 80, unit: '250g', inStock: true },
  { id: '27', name: 'Honey', description: 'Pure natural honey for puja', category: 'Offerings', price: 180, unit: '250ml', inStock: true },
  { id: '28', name: 'Sacred Thread (Moli)', description: 'Red sacred thread for rituals', category: 'Accessories', price: 20, unit: 'roll', inStock: true },
  { id: '29', name: 'Cotton Wicks', description: 'Cotton diya wicks - pack of 50', category: 'Accessories', price: 25, unit: 'pack', inStock: true },
  { id: '30', name: 'Puja Bell', description: 'Brass bell for aarti', category: 'Accessories', price: 120, unit: 'piece', inStock: true },
  { id: '31', name: 'Mango Leaves', description: 'Fresh mango leaves for decoration', category: 'Accessories', price: 30, unit: 'bunch', inStock: true },
  { id: '32', name: 'Puja Cloth (Red)', description: 'Red cloth for covering puja items', category: 'Accessories', price: 80, unit: 'piece', inStock: true },
  { id: '33', name: 'Complete Puja Kit', description: 'All essential items for any puja', category: 'Accessories', price: 850, unit: 'kit', inStock: true },
];

export default function SamagriScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { items, addItem, removeItem, getTotal, getItemCount, getDeliveryFee } = useCartStore();

  const filtered = selectedCategory === 'All' ? SAMAGRI_ITEMS : SAMAGRI_ITEMS.filter(i => i.category === selectedCategory);
  const itemCount = getItemCount();
  const total = getTotal();
  const delivery = getDeliveryFee();

  const getQuantity = (id: string) => {
    const found = items.find(ci => ci.id === id);
    return found ? found.cartQuantity : 0;
  };

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Puja Samagri</Text>
          <Text style={styles.subtitle}>Get items delivered at your doorstep</Text>
        </View>
        {itemCount > 0 && (
          <Pressable onPress={() => router.push('/booking/cart')} style={styles.cartBtn}>
            <Text style={styles.cartIcon}>🛒</Text>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{itemCount}</Text></View>
          </Pressable>
        )}
      </View>

      {/* Category filter */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={item} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
        )}
      />

      {/* Items list */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.map(item => (
          <SamagriItemCard
            key={item.id}
            item={item}
            quantity={getQuantity(item.id)}
            onAdd={() => addItem(item)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Cart summary bar */}
      {itemCount > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartBarItems}>{itemCount} items • {delivery === 0 ? 'Free Delivery 🎉' : `+₹${delivery} delivery`}</Text>
            <Text style={styles.cartBarTotal}>Total: ₹{(total + delivery).toLocaleString('en-IN')}</Text>
          </View>
          <Pressable onPress={() => router.push('/booking/cart')} style={styles.viewCartBtn}>
            <Text style={styles.viewCartText}>View Cart →</Text>
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 24, paddingBottom: spacing.md,
  },
  title: { ...typography.displayMedium, color: colors.textPrimary },
  subtitle: { ...typography.bodyMedium, color: colors.textMuted, marginTop: 4 },
  cartBtn: { position: 'relative', padding: spacing.sm },
  cartIcon: { fontSize: 28 },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { ...typography.badge, color: '#fff', fontSize: 9 },
  chipRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  cartBar: {
    position: 'absolute', bottom: 80, left: spacing.lg, right: spacing.lg,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.lg, padding: spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: colors.cardBorder,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10,
  },
  cartBarItems: { ...typography.bodySmall, color: colors.textSecondary },
  cartBarTotal: { ...typography.titleMedium, color: colors.primary },
  viewCartBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.sm },
  viewCartText: { ...typography.button, color: '#fff', fontSize: 14 },
});
