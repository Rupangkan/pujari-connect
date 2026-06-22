/**
 * FOR YOU Tab — Home feed with featured pujas, pujaris by ethnicity
 * Ported from MyPandit's ForYouScreen.kt
 */
import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, FlatList,
  Dimensions, Pressable, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { EventCard } from '@/components/cards/EventCard';
import { MoodCard } from '@/components/cards/MoodCard';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { LocationHeader, SearchBar } from '@/components/layout/SearchBar';
import { config } from '@/constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.80;
const CARD_MARGIN = 12;

// Static featured data (will be replaced by API in production)
const FEATURED_EVENTS = [
  { id: '1', title: 'Griha Pravesh Puja', dateTime: 'Available Daily', venue: 'At Your Home', price: '₹5,100', discountText: 'Book Now - Free Consultation' },
  { id: '2', title: 'Ganesh Puja', dateTime: '15 Feb 2026 • 6:00 AM', venue: 'Kamakhya Temple', price: '₹2,999', discountText: '20% OFF - Limited Slots' },
  { id: '3', title: 'Satyanarayan Puja', dateTime: 'Every Full Moon', venue: 'Online or At Temple', price: '₹3,500', discountText: 'Group Booking Available' },
  { id: '4', title: 'Lakshmi Puja', dateTime: 'Festival Season', venue: 'Haridwar Temple', price: '₹2,100', discountText: 'Early Bird - 15% OFF' },
  { id: '5', title: 'Pitru Paksha Shanti', dateTime: '20 Sep - 5 Oct', venue: 'Gaya, Bihar', price: '₹5,693', discountText: 'Special Package - Includes Tarpan' },
];

const ETHNICITY_MOODS = [
  { id: '1', title: 'Assamese', emoji: '🌺' },
  { id: '2', title: 'Bengali', emoji: '🌸' },
  { id: '3', title: 'Hindi', emoji: '🙏' },
  { id: '4', title: 'Tamil', emoji: '🪔' },
  { id: '5', title: 'Telugu', emoji: '🌿' },
  { id: '6', title: 'Kannada', emoji: '⭐' },
];

export default function ForYouScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN));
    setActiveIndex(index);
  };

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LocationHeader
          location={config.DEFAULT_LOCATION_DETAIL}
          onProfilePress={() => router.push('/profile')}
        />
        <SearchBar onPress={() => router.push('/search')} />

        {/* Popular Carousel */}
        <SectionHeader title="✨ Popular" />
        <FlatList
          ref={flatListRef}
          data={FEATURED_EVENTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              width={CARD_WIDTH}
              onPress={() => router.push(`/puja/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: CARD_MARGIN }} />}
        />
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {FEATURED_EVENTS.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Pujas Near You */}
        <SectionHeader
          title="🗺️ Pujas Near You"
          onViewAll={() => router.push('/pujari/all')}
        />
        <FlatList
          data={ETHNICITY_MOODS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodContainer}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MoodCard
              title={item.title}
              emoji={item.emoji}
              onPress={() => router.push({ pathname: '/pujari/all', params: { ethnicity: item.title } })}
            />
          )}
        />

        {/* Featured Section Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['rgba(255,121,44,0.15)', 'rgba(255,237,41,0.08)']}
            style={styles.banner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bannerEmoji}>🎉</Text>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>First Booking Free!</Text>
              <Text style={styles.bannerSubtitle}>Get a free consultation with any pujari</Text>
            </View>
            <Pressable onPress={() => router.push('/puja/all')} style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Explore</Text>
            </Pressable>
          </LinearGradient>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  carouselContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: spacing.sm, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cardBorder },
  dotActive: { width: 20, backgroundColor: colors.primary },
  moodContainer: { paddingHorizontal: spacing.lg, gap: spacing.lg, paddingBottom: spacing.sm },
  bannerContainer: { marginHorizontal: spacing.lg, marginTop: spacing.md },
  banner: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.lg,
    borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(255,121,44,0.2)',
  },
  bannerEmoji: { fontSize: 28, marginRight: spacing.md },
  bannerContent: { flex: 1 },
  bannerTitle: { ...typography.titleMedium, color: colors.primary },
  bannerSubtitle: { ...typography.bodySmall, color: colors.textMuted },
  bannerBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: borderRadius.sm },
  bannerBtnText: { ...typography.labelMedium, color: '#fff', fontWeight: '700' },
});
