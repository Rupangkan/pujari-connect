/**
 * Payments — saved methods + transaction history. Light theme.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Icon, type IconName } from '@/components/ui/Icon';

const METHODS: { icon: IconName; label: string; sub: string }[] = [
  { icon: 'phone-portrait-outline', label: 'UPI — bishal@okhdfc', sub: 'Default' },
  { icon: 'card-outline', label: 'HDFC Card •••• 4242', sub: 'Visa · Expires 09/28' },
];

const TXNS = [
  { id: 'TXN-9921', title: 'Griha Pravesh Puja', date: '15 Oct 2026', amount: 8500, status: 'Paid' },
  { id: 'TXN-9876', title: 'Samagri Order', date: '2 Oct 2026', amount: 540, status: 'Paid' },
  { id: 'TXN-9810', title: 'Satyanarayan Puja', date: '10 Sep 2026', amount: 3500, status: 'Refunded' },
];

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <ScreenHeader title="Payments" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }}>
        <Text style={styles.section}>Saved Methods</Text>
        {METHODS.map((m) => (
          <View key={m.label} style={styles.methodCard}>
            <View style={styles.methodIcon}><Icon name={m.icon} size={20} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
          </View>
        ))}
        <Pressable style={styles.addBtn}>
          <Icon name="add" size={20} color={colors.primary} />
          <Text style={styles.addText}>Add Payment Method</Text>
        </Pressable>

        <Text style={styles.section}>Transaction History</Text>
        {TXNS.map((t) => {
          const refunded = t.status === 'Refunded';
          return (
            <View key={t.id} style={styles.txnRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.txnTitle}>{t.title}</Text>
                <Text style={styles.txnMeta}>{t.id} · {t.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.txnAmount}>₹{t.amount.toLocaleString('en-IN')}</Text>
                <Text style={[styles.txnStatus, { color: refunded ? colors.info : colors.success }]}>{t.status}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.titleMedium, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  methodIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  methodLabel: { ...typography.titleSmall, color: colors.textPrimary },
  methodSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.xs },
  addText: { ...typography.titleSmall, color: colors.primary },
  txnRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  txnTitle: { ...typography.titleSmall, color: colors.textPrimary },
  txnMeta: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  txnAmount: { ...typography.titleSmall, color: colors.textPrimary },
  txnStatus: { ...typography.labelSmall, fontWeight: '600', marginTop: 2 },
});
