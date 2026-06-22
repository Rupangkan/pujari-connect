/**
 * All Pujas — Full listing with category/type/price filters
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, FlatList, Pressable, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Chip } from '@/components/ui/Chip';
import { EventCard } from '@/components/cards/EventCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_W = (SCREEN_WIDTH - spacing.lg * 2 - 12) / 2;

const ALL_PUJAS = [
  { id: '1', title: 'Griha Pravesh Puja', dateTime: 'Book Anytime', venue: 'At Your Home', price: '₹5,100', category: 'HOME', type: 'OFFLINE', discountText: 'Most Popular' },
  { id: '2', title: 'Satyanarayan Puja', dateTime: 'Daily', venue: 'Kashi / Online', price: '₹3,500', category: 'PERSONAL', type: 'BOTH' },
  { id: '3', title: 'Lakshmi Puja', dateTime: '20 Sep - 5 Oct', venue: 'Haridwar', price: '₹2,100', category: 'FESTIVAL', type: 'ONLINE', discountText: '15% OFF Online' },
  { id: '4', title: 'Ganesh Puja', dateTime: '1 Sep - 10 Oct', venue: 'Mumbai / Online', price: '₹2,500', category: 'PERSONAL', type: 'BOTH' },
  { id: '5', title: 'Pitru Shanti Mahapuja', dateTime: '2 Oct - 1 Nov', venue: 'Gaya, Bihar', price: '₹5,693', category: 'ANCESTRAL', type: 'ONLINE', discountText: 'Includes Tarpan' },
  { id: '6', title: 'Ganesh Chaturthi', dateTime: '7 Sep 2026', venue: 'Your Home', price: '₹2,500', category: 'HOME', type: 'OFFLINE' },
  { id: '7', title: 'Navratri Complete', dateTime: '3-12 Oct 2026', venue: 'Your Home — 9 Days', price: '₹15,000', category: 'HOME', type: 'OFFLINE', discountText: 'All Included' },
  { id: '8', title: 'Vastu Shanti Puja', dateTime: 'Anytime', venue: 'Your Location', price: '₹7,500', category: 'HOME', type: 'OFFLINE' },
  { id: '9', title: 'Rudrabhishek', dateTime: 'Every Monday', venue: 'Somnath Temple', price: '₹1,100', category: 'TEMPLE', type: 'OFFLINE' },
  { id: '10', title: 'Hanuman Chalisa Path', dateTime: 'Every Tuesday', venue: 'Hanuman Temple, Delhi', price: '₹500', category: 'TEMPLE', type: 'OFFLINE' },
  { id: '11', title: 'Saraswati Puja', dateTime: '14 Feb 2026', venue: 'Kamakhya Temple', price: '₹1,800', category: 'TEMPLE', type: 'OFFLINE', discountText: 'Student Special' },
];

const CATEGORIES = ['All', 'HOME', 'PERSONAL', 'FESTIVAL', 'TEMPLE', 'ANCESTRAL'];
const TYPES = ['All', 'ONLINE', 'OFFLINE', 'BOTH'];
const CATEGORY_LABELS: Record<string, string> = { All: 'All', HOME: 'Home', PERSONAL: 'Personal', FESTIVAL: 'Festival', TEMPLE: 'Temple', ANCESTRAL: 'Ancestral' };
const TYPE_LABELS: Record<string, string> = { All: 'All Types', ONLINE: '🌐 Online', OFFLINE: '🏠 In-Person', BOTH: '🔀 Both' };
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low'];

export default function AllPujasScreen() {
  const { category: initialCategory } = useLocalSearchParams<{ category: string }>();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filtered = useMemo(() => {
    let list = ALL_PUJAS
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .filter(p => selectedType === 'All' || p.type === selectedType);
    if (selectedSort === 'Price: Low to High') {
      list = [...list].sort((a, b) => parseInt(a.price.replace(/[₹,]/g, '')) - parseInt(b.price.replace(/[₹,]/g, '')));
    } else if (selectedSort === 'Price: High to Low') {
      list = [...list].sort((a, b) => parseInt(b.price.replace(/[₹,]/g, '')) - parseInt(a.price.replace(/[₹,]/g, '')));
    }
    return list;
  }, [selectedCategory, selectedType, selectedSort]);

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>All Pujas</Text>
          <Text style={styles.subtitle}>{filtered.length} rituals available</Text>
        </View>
        <Pressable onPress={() => setShowSortMenu(s => !s)} style={styles.sortBtn}>
          <Text style={styles.sortIcon}>⇅</Text>
          <Text style={styles.sortLabel}>Sort</Text>
        </Pressable>
      </View>

      {/* Sort dropdown */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map(opt => (
            <Pressable key={opt} onPress={() => { setSelectedSort(opt); setShowSortMenu(false); }} style={[styles.sortOption, selectedSort === opt && styles.sortOptionActive]}>
              <Text style={[styles.sortOptionText, selectedSort === opt && styles.sortOptionTextActive]}>{opt}</Text>
              {selectedSort === opt && <Text style={styles.sortCheck}>✓</Text>}
            </Pressable>
          ))}
        </View>
      )}

      {/* Category chips */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={CATEGORY_LABELS[item]} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
        )}
      />

      {/* Type chips */}
      <FlatList
        data={TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeChipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={TYPE_LABELS[item]} size="sm" selected={selectedType === item} onPress={() => setSelectedType(item)} />
        )}
      />

      {/* Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🪔</Text>
            <Text style={styles.emptyTitle}>No pujas found</Text>
            <Text style={styles.emptySubtitle}>Try different filters</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map(item => (
              <EventCard
                key={item.id}
                event={item}
                width={CARD_W}
                compact
                onPress={() => router.push(`/puja/${item.id}`)}
              />
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: { padding: spacing.xs },
  backIcon: { fontSize: 24, color: colors.textPrimary, marginRight: spacing.md },
  headerText: { flex: 1 },
  title: { ...typography.headlineLarge, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textMuted },
  sortBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.cardBorder },
  sortIcon: { fontSize: 16, marginRight: 4 },
  sortLabel: { ...typography.labelMedium, color: colors.textSecondary },
  sortMenu: { position: 'absolute', top: 120, right: spacing.lg, zIndex: 100, backgroundColor: colors.surfaceContainerHighest, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  sortOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 180, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  sortOptionActive: { backgroundColor: 'rgba(255,121,44,0.1)' },
  sortOptionText: { ...typography.bodyMedium, color: colors.textSecondary },
  sortOptionTextActive: { color: colors.primary, fontWeight: '600' },
  sortCheck: { color: colors.primary, fontWeight: '700' },
  chipRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  typeChipRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: 12, marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.massive },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted },
});
