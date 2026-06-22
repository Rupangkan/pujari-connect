/**
 * Booking History Screen
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Chip } from '@/components/ui/Chip';

// Mock booking data
const BOOKINGS = [
  {
    id: 'BK-123456',
    status: 'CONFIRMED',
    pujaName: 'Griha Pravesh Puja',
    date: '15 Oct 2026',
    time: '08:00 AM',
    amount: 8500,
    pujariName: 'Pandit Rajesh Sharma',
  },
  {
    id: 'BK-123457',
    status: 'COMPLETED',
    pujaName: 'Satyanarayan Puja',
    date: '10 Sep 2026',
    time: '10:00 AM',
    amount: 3500,
    pujariName: 'Swami Bishal Nayan Das',
  },
  {
    id: 'BK-123458',
    status: 'CANCELLED',
    pujaName: 'Ganesh Puja',
    date: '5 Aug 2026',
    time: '09:00 AM',
    amount: 2500,
    pujariName: 'Pandit Suresh Joshi',
  },
];

const FILTER_TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED': return colors.success;
    case 'COMPLETED': return colors.info;
    case 'CANCELLED': return colors.error;
    default: return colors.warning;
  }
};

export default function BookingHistoryScreen() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredBookings = BOOKINGS.filter(b => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming' && (b.status === 'CONFIRMED' || b.status === 'PENDING')) return true;
    if (activeTab === 'Completed' && b.status === 'COMPLETED') return true;
    if (activeTab === 'Cancelled' && b.status === 'CANCELLED') return true;
    return false;
  });

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {FILTER_TABS.map(tab => (
            <Chip 
              key={tab} 
              label={tab} 
              selected={activeTab === tab} 
              onPress={() => setActiveTab(tab)} 
            />
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>You don't have any {activeTab.toLowerCase()} bookings yet.</Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/puja/all')}>
              <Text style={styles.exploreText}>Explore Pujas</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => {/* Navigate to booking details if implemented */}}>
            <View style={styles.cardHeader}>
              <Text style={styles.bookingId}>{item.id}</Text>
              <View style={[styles.statusBadge, { borderColor: getStatusColor(item.status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.pujaName}>{item.pujaName}</Text>
              <Text style={styles.dateTime}>📅 {item.date} • ⏰ {item.time}</Text>
              <Text style={styles.pujariName}>🙏 {item.pujariName}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountValue}>₹{item.amount.toLocaleString()}</Text>
            </View>
          </Pressable>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  backBtn: { marginRight: spacing.md, padding: spacing.xs },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  tabContainer: { paddingBottom: spacing.sm },
  tabScroll: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  // Empty State
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.massive * 2 },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  exploreBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md },
  exploreText: { ...typography.button, color: '#fff' },
  // Card
  card: { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: spacing.md, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, backgroundColor: 'rgba(255,255,255,0.03)', borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  bookingId: { ...typography.labelMedium, color: colors.textMuted },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  statusText: { ...typography.badge, fontSize: 10 },
  cardBody: { padding: spacing.md },
  pujaName: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.sm },
  dateTime: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  pujariName: { ...typography.bodySmall, color: colors.textMuted },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  amountLabel: { ...typography.labelSmall, color: colors.textMuted },
  amountValue: { ...typography.titleMedium, color: colors.accentYellow },
});
