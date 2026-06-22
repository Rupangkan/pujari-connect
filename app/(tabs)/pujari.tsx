/**
 * PUJARI Tab — Browse and book pujaris
 * Ported from MyPandit's PujariScreen.kt
 */
import React, { useRef, useState } from 'react';
import {
  View, ScrollView, StyleSheet, FlatList,
  Dimensions, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/typography';
import { PujariCard } from '@/components/cards/PujariCard';
import { EventCard } from '@/components/cards/EventCard';
import { MoodCard } from '@/components/cards/MoodCard';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { LocationHeader, SearchBar } from '@/components/layout/SearchBar';
import { config } from '@/constants/config';
import { Pujari } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const TOP_PUJARIS: Pujari[] = [
  { id: '1', name: 'Pandit Rajesh Sharma', experience: 15, ethnicity: 'Hindi', specialization: 'Griha Pravesh, Wedding Ceremonies', phone: '+91-9876543210', email: 'rajesh@mypujari.com', location: 'Guwahati', rating: 4.8, totalBookings: 523, hourlyRate: 1500, bio: 'Expert in Vedic rituals with 15+ years of experience. Specialized in home pujas and wedding ceremonies.', languages: 'Hindi, English, Assamese', isVerified: true },
  { id: '2', name: 'Swami Bishal Nayan Das', experience: 25, ethnicity: 'Bengali', specialization: 'Pitru Shanti, Satyanarayan Puja', phone: '+91-9876543211', email: 'bishal@mypujari.com', location: 'Guwahati', rating: 4.9, totalBookings: 1247, hourlyRate: 2000, bio: 'Renowned scholar of Vedic scriptures. Performs authentic traditional rituals.', languages: 'Bengali, Hindi, English', isVerified: true },
  { id: '3', name: 'Pandit Suresh Joshi', experience: 10, ethnicity: 'Assamese', specialization: 'Festival Pujas, Lakshmi Puja', phone: '+91-9876543212', email: 'suresh@mypujari.com', location: 'Guwahati', rating: 4.6, totalBookings: 345, hourlyRate: 1200, bio: 'Young and energetic pandit bringing fresh approach to traditional rituals.', languages: 'Assamese, Hindi, English', isVerified: true },
  { id: '4', name: 'Acharya Ramakrishna Iyer', experience: 30, ethnicity: 'Tamil', specialization: 'Temple Pujas, Homam', phone: '+91-9876543213', email: 'ramakrishna@mypujari.com', location: 'Guwahati', rating: 4.9, totalBookings: 2156, hourlyRate: 2500, bio: 'Senior priest with extensive knowledge of South Indian temple traditions.', languages: 'Tamil, Sanskrit, English', isVerified: true },
];

const HOME_PUJAS = [
  { id: '1', title: 'Ganesh Chaturthi Puja', dateTime: '7 Sep 2026', venue: 'Your Home - Guwahati', price: '₹2,500', discountText: 'Includes Puja Kit' },
  { id: '7', title: 'Navratri Complete Package', dateTime: '3-12 Oct 2026', venue: 'Your Home - 9 Days', price: '₹15,000', discountText: 'All Materials Included' },
  { id: '8', title: 'Vastu Shanti Puja', dateTime: 'Book Anytime', venue: 'Your Office/Home', price: '₹7,500', discountText: 'Expert Vastu Consultation Free' },
];

const TEMPLE_PUJAS = [
  { id: '9', title: 'Rudrabhishek', dateTime: 'Every Monday', venue: 'Kamakhya Temple', price: '₹1,100' },
  { id: '10', title: 'Hanuman Chalisa Path', dateTime: 'Every Tuesday', venue: 'Hanuman Temple', price: '₹500' },
  { id: '11', title: 'Saraswati Puja', dateTime: '14 Feb 2026', venue: 'Kamakhya Temple', price: '₹1,800', discountText: 'Student Special' },
];

const ETHNICITY_MOODS = [
  { id: '1', title: 'Assamese', emoji: '🌺' },
  { id: '2', title: 'Bengali', emoji: '🌸' },
  { id: '3', title: 'Hindi', emoji: '🙏' },
  { id: '4', title: 'Tamil', emoji: '🪔' },
  { id: '5', title: 'Telugu', emoji: '🌿' },
];

export default function PujariScreen() {
  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LocationHeader location={config.DEFAULT_LOCATION_DETAIL} onProfilePress={() => router.push('/profile')} />
        <SearchBar onPress={() => router.push('/search')} placeholder="Search for Pujari, Pandit..." />

        {/* Top Pujaris */}
        <SectionHeader title="⭐ Top Pujaris" onViewAll={() => router.push('/pujari/all')} />
        <FlatList
          data={TOP_PUJARIS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PujariCard
              pujari={item}
              width={CARD_WIDTH}
              onPress={() => router.push(`/pujari/${item.id}`)}
              onBook={() => router.push(`/pujari/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />

        {/* Book by Ethnicity */}
        <SectionHeader title="🌍 Book a Pujari" onViewAll={() => router.push('/pujari/all')} />
        <FlatList
          data={ETHNICITY_MOODS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodRow}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MoodCard title={item.title} emoji={item.emoji}
              onPress={() => router.push({ pathname: '/pujari/all', params: { ethnicity: item.title } })} />
          )}
        />

        {/* Pujas at Home */}
        <SectionHeader title="🏠 Pujas at Home" onViewAll={() => router.push({ pathname: '/puja/all', params: { category: 'HOME' } })} />
        <FlatList
          data={HOME_PUJAS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} width={260} compact onPress={() => router.push(`/puja/${item.id}`)} />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />

        {/* Pujas at Temple */}
        <SectionHeader title="⛪ Pujas at Temple" onViewAll={() => router.push({ pathname: '/puja/all', params: { category: 'TEMPLE' } })} />
        <FlatList
          data={TEMPLE_PUJAS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} width={260} compact onPress={() => router.push(`/puja/${item.id}`)} />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  carousel: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  moodRow: { paddingHorizontal: spacing.lg, gap: spacing.lg, paddingBottom: spacing.sm },
});
