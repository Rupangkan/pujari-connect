/**
 * Booking History Screen (live data, auth-gated).
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { bookingService } from '@/services/booking.service';
import { formatINR } from '@/utils/mappers';
import { useAuthStore } from '@/store/authStore';

const FILTER_TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const statusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED': return colors.success;
    case 'COMPLETED': return colors.info;
    case 'CANCELLED': return colors.error;
    default: return colors.warning;
  }
};

interface BookingRow {
  id: string; status: string; pujaName: string; date: string; time: string; amount: number; pujariName: string;
}

function toRow(b: any): BookingRow {
  const d = b.bookingDate ? new Date(b.bookingDate) : null;
  return {
    id: b.id,
    status: b.status,
    pujaName: b.puja?.name ?? 'Puja',
    date: d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    time: d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    amount: b.totalAmount ?? 0,
    pujariName: b.pujari?.name ?? 'To be assigned',
  };
}

export default function BookingHistoryScreen() {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const [activeTab, setActiveTab] = useState('All');

  const { data, loading, error, reload } = useApi<BookingRow[]>(
    () => isAuth ? bookingService.getAll().then(r => ((r.data as any).data as any[]).map(toRow)) : Promise.resolve([]),
    [isAuth]
  );
  const bookings = data ?? [];

  const filtered = bookings.filter(b => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'IN_PROGRESS';
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

      {!isAuth ? (
        <EmptyView icon="receipt-outline" title="Sign in to see your bookings" subtitle="Your booking history appears here once you sign in." actionLabel="Sign In" onAction={() => router.replace('/(auth)/onboarding')} />
      ) : (
        <>
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {FILTER_TABS.map(tab => (
                <Chip key={tab} label={tab} selected={activeTab === tab} onPress={() => setActiveTab(tab)} />
              ))}
            </ScrollView>
          </View>

          {loading ? (
            <LoadingView />
          ) : error ? (
            <ErrorView message={error} onRetry={reload} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <EmptyView icon="receipt-outline" title="No bookings found" subtitle={`You don't have any ${activeTab.toLowerCase()} bookings yet.`} actionLabel="Explore Pujas" onAction={() => router.push('/puja/all')} />
              }
              renderItem={({ item }) => {
                const sc = statusColor(item.status);
                return (
                  <Pressable style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.bookingId}>#{item.id.slice(-8).toUpperCase()}</Text>
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
                        {!!item.time && <Icon name="time-outline" size={13} color={colors.textMuted} style={{ marginLeft: spacing.md }} />}
                        {!!item.time && <Text style={styles.metaText}>{item.time}</Text>}
                      </View>
                      <View style={styles.metaRow}>
                        <Icon name="person-outline" size={13} color={colors.textMuted} />
                        <Text style={styles.metaText}>{item.pujariName}</Text>
                      </View>
                    </View>
                    <View style={styles.cardFooter}>
                      <Text style={styles.amountLabel}>Total Amount</Text>
                      <Text style={styles.amountValue}>{formatINR(item.amount)}</Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  tabContainer: { paddingBottom: spacing.sm },
  tabScroll: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, flexGrow: 1 },
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
