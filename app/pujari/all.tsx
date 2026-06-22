/**
 * All Pujaris — Full listing with ethnicity/rating/experience filters
 * Ported from MyPandit's PujariScreen full listing
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
import { PujariCard } from '@/components/cards/PujariCard';
import { Pujari } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ALL_PUJARIS: Pujari[] = [
  { id: '1', name: 'Pandit Rajesh Sharma', experience: 15, ethnicity: 'Hindi', specialization: 'Griha Pravesh, Wedding Ceremonies', phone: '+91-9876543210', email: 'rajesh@mypujari.com', location: 'Guwahati', rating: 4.8, totalBookings: 523, hourlyRate: 1500, bio: 'Expert in Vedic rituals with 15+ years of experience. Specialized in home pujas and wedding ceremonies.', languages: 'Hindi, English, Assamese', isVerified: true },
  { id: '2', name: 'Swami Bishal Nayan Das', experience: 25, ethnicity: 'Bengali', specialization: 'Pitru Shanti, Satyanarayan Puja', phone: '+91-9876543211', email: 'bishal@mypujari.com', location: 'Guwahati', rating: 4.9, totalBookings: 1247, hourlyRate: 2000, bio: 'Renowned scholar of Vedic scriptures. Performs authentic traditional rituals with deep spiritual understanding.', languages: 'Bengali, Hindi, English', isVerified: true },
  { id: '3', name: 'Pandit Suresh Joshi', experience: 10, ethnicity: 'Assamese', specialization: 'Festival Pujas, Lakshmi Puja', phone: '+91-9876543212', email: 'suresh@mypujari.com', location: 'Guwahati', rating: 4.6, totalBookings: 345, hourlyRate: 1200, bio: 'Young and energetic pandit bringing fresh approach to traditional rituals while maintaining authenticity.', languages: 'Assamese, Hindi, English', isVerified: true },
  { id: '4', name: 'Acharya Ramakrishna Iyer', experience: 30, ethnicity: 'Tamil', specialization: 'Temple Pujas, Homam', phone: '+91-9876543213', email: 'ramakrishna@mypujari.com', location: 'Guwahati', rating: 4.9, totalBookings: 2156, hourlyRate: 2500, bio: 'Senior priest with extensive knowledge of South Indian temple traditions and Agama Shastra.', languages: 'Tamil, Sanskrit, English', isVerified: true },
];

const ETHNICITIES = ['All', 'Assamese', 'Bengali', 'Hindi', 'Tamil', 'Telugu'];
const SORT_OPTIONS = ['Top Rated', 'Most Experienced', 'Price: Low to High', 'Price: High to Low', 'Most Booked'];

export default function AllPujarisScreen() {
  const { ethnicity: initialEthnicity } = useLocalSearchParams<{ ethnicity: string }>();
  const [selectedEthnicity, setSelectedEthnicity] = useState(initialEthnicity || 'All');
  const [selectedSort, setSelectedSort] = useState('Top Rated');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filtered = useMemo(() => {
    let list = selectedEthnicity === 'All' ? ALL_PUJARIS : ALL_PUJARIS.filter(p => p.ethnicity === selectedEthnicity);
    if (selectedSort === 'Top Rated') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (selectedSort === 'Most Experienced') list = [...list].sort((a, b) => b.experience - a.experience);
    else if (selectedSort === 'Price: Low to High') list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (selectedSort === 'Price: High to Low') list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate);
    else if (selectedSort === 'Most Booked') list = [...list].sort((a, b) => b.totalBookings - a.totalBookings);
    return list;
  }, [selectedEthnicity, selectedSort]);

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Find a Pujari</Text>
          <Text style={styles.subtitle}>{filtered.length} pujaris available</Text>
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

      {/* Ethnicity filter */}
      <FlatList
        data={ETHNICITIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={item} selected={selectedEthnicity === item} onPress={() => setSelectedEthnicity(item)} />
        )}
      />

      {/* Pujari list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.map(pujari => (
          <PujariCard
            key={pujari.id}
            pujari={pujari}
            width={SCREEN_WIDTH - spacing.lg * 2}
            onPress={() => router.push(`/pujari/${pujari.id}`)}
            onBook={() => router.push(`/pujari/${pujari.id}`)}
          />
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🙏</Text>
            <Text style={styles.emptyTitle}>No pujaris found</Text>
            <Text style={styles.emptySubtitle}>Try changing the ethnicity filter</Text>
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
  sortOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 200, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  sortOptionActive: { backgroundColor: 'rgba(255,121,44,0.1)' },
  sortOptionText: { ...typography.bodyMedium, color: colors.textSecondary },
  sortOptionTextActive: { color: colors.primary, fontWeight: '600' },
  sortCheck: { color: colors.primary, fontWeight: '700' },
  chipRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.massive },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted },
});
