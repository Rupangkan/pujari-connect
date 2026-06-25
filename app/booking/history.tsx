/**
 * Booking History Screen. Light Ivory & Gold theme.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';

const BOOKINGS = [
  { id: 'BK-123456', status: 'CONFIRMED', pujaName: 'Griha Pravesh Puja', date: '15 Oct 2026', time: '08:00 AM', amount: 8500, pujariName: 'Pandit Rajesh Sharma' },
  { id: 'BK-123457', status: 'COMPLETED', pujaName: 'Satyanarayan Puja', date: '10 Sep 2026', time: '10:00 AM', amount: 3500, pujariName: 'Swami Bishal Nayan Das' },
  { id: 'BK-123458', status: 'CANCELLED', pujaName: 'Ganesh Puja', date: '5 Aug 2026', time: '09:00 AM', amount: 2500, pujariName: 'Pandit Suresh Joshi' },
];

const FILTER_TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const statusColor = (status: string) => {
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
    if (activeTab === 'Upcoming') return b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (activeTab === 'Completed') return b.status === 'COMPLETED';
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED';
    return false;
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {FILTER_TABS.map(tab => (
            <Chip key={tab} label={tab} selected={activeTab === tab} onPress={() => setActiveTab(tab)} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}><Icon name="receipt-outline" size={44} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>You don't have any {activeTab.toLowerCase()} bookings yet.</Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/puja/all')}>
              <Text style={styles.exploreText}>Explore Pujas</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const sc = statusColor(item.status);
          return (
            <Pressable style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.bookingId}>{item.id}</Text>
                <View style={[styles.statusBadge, { borderColor: sc }]}>
                  <View style={[styles.statusDot, { backgroundColor: sc }]} />
                  <Text style={[styles.statusText, { color: sc }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.pujaName}>{item.pujaName}</Text>
                <View style={styles.metaRow}>
                  <Icon name="calendar-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.metaText}>{item.date}</Text>
                  <Icon name="time-outline" size={13} color={colors.textMuted} style={{ marginLeft: spacing.md }} />
                  <Text style={styles.metaText}>{item.time}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Icon name="person-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.metaText}>{item.pujariName}</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.amountLabel}>Total Amount</Text>
                <Text style={styles.amountValue}>₹{item.amount.toLocaleString('en-IN')}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  tabContainer: { paddingBottom: spacing.sm },
  tabScroll: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.massive },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  emptyTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  exploreBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  exploreText: { ...typography.button, color: colors.textOnPrimary },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: spacing.md, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, backgroundColor: colors.surfaceContainerLow, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  bookingId: { ...typography.labelMedium, color: colors.textMuted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full, borderWidth: 1, backgroundColor: colors.surface },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { ...typography.badge, fontSize: 10 },
  cardBody: { padding: spacing.md },
  pujaName: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.xs },
  metaText: { ...typography.bodySmall, color: colors.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  amountLabel: { ...typography.labelSmall, color: colors.textMuted },
  amountValue: { ...typography.titleMedium, color: colors.primary },
});
