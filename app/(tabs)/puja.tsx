/**
 * PUJA Tab — browse all pujas with category filter (2-column grid).
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/cards/EventCard';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { SearchBar } from '@/components/layout/SearchBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - GRID_GAP) / 2;

const CATEGORIES = ['All', 'Home', 'Personal', 'Festival', 'Temple', 'Ancestral'];

const ALL_PUJAS = [
  { id: '1', title: 'Griha Pravesh Puja', dateTime: 'Book Anytime', venue: 'At Your Home', price: '₹5,100', category: 'Home', discountText: 'Popular' },
  { id: '2', title: 'Satyanarayan Puja', dateTime: 'Daily', venue: 'Kashi / Online', price: '₹3,500', category: 'Personal' },
  { id: '3', title: 'Lakshmi Puja', dateTime: '20 Sep - 5 Oct', venue: 'Haridwar', price: '₹2,100', category: 'Festival', discountText: '15% OFF' },
  { id: '4', title: 'Ganesh Puja', dateTime: '1 Sep - 10 Oct', venue: 'Mumbai / Online', price: '₹2,500', category: 'Personal' },
  { id: '5', title: 'Pitru Shanti Mahapuja', dateTime: '2 Oct - 1 Nov', venue: 'Gaya, Bihar', price: '₹5,693', category: 'Ancestral', discountText: 'Includes Tarpan' },
  { id: '6', title: 'Ganesh Chaturthi Puja', dateTime: '7 Sep 2026', venue: 'Your Home', price: '₹2,500', category: 'Home' },
  { id: '7', title: 'Navratri Complete Package', dateTime: '3-12 Oct 2026', venue: 'Your Home — 9 Days', price: '₹15,000', category: 'Home', discountText: 'All Included' },
  { id: '8', title: 'Vastu Shanti Puja', dateTime: 'Anytime', venue: 'Your Location', price: '₹7,500', category: 'Home' },
  { id: '9', title: 'Rudrabhishek', dateTime: 'Every Monday', venue: 'Somnath Temple', price: '₹1,100', category: 'Temple' },
  { id: '10', title: 'Hanuman Chalisa Path', dateTime: 'Every Tuesday', venue: 'Hanuman Temple, Delhi', price: '₹500', category: 'Temple' },
  { id: '11', title: 'Saraswati Puja', dateTime: '14 Feb 2026', venue: 'Kamakhya Temple', price: '₹1,800', category: 'Temple', discountText: 'Student Special' },
];

export default function PujaScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All'
    ? ALL_PUJAS
    : ALL_PUJAS.filter(p => p.category === selectedCategory);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Puja Booking</Text>
        <Text style={styles.subtitle}>Choose from our curated rituals</Text>
      </View>
      <SearchBar onPress={() => router.push('/search')} placeholder="Search pujas by name, category..." />

      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.chipContainer}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Chip label={item} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
        )}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <SectionHeader title={`${filtered.length} ${selectedCategory !== 'All' ? selectedCategory : 'Pujas'} Available`} />
        <View style={styles.grid}>
          {filtered.map((item) => (
            <EventCard
              key={item.id}
              event={item}
              width={COLUMN_WIDTH}
              compact
              onPress={() => router.push(`/puja/${item.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { ...typography.displayMedium, color: colors.textPrimary },
  subtitle: { ...typography.bodyMedium, color: colors.textMuted, marginTop: 4 },
  chipList: { flexGrow: 0 },
  chipContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: GRID_GAP,
  },
});
