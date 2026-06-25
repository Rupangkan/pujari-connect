/**
 * Notifications — preference toggles + recent alerts. Light theme.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Icon, type IconName } from '@/components/ui/Icon';

const PREFS: { key: string; label: string; sub: string }[] = [
  { key: 'bookings', label: 'Booking Updates', sub: 'Confirmations, reminders & changes' },
  { key: 'offers', label: 'Offers & Promotions', sub: 'Discounts and seasonal deals' },
  { key: 'reminders', label: 'Puja Reminders', sub: 'Alerts before your scheduled puja' },
  { key: 'newsletter', label: 'Newsletter', sub: 'Festivals, tips & spiritual content' },
];

const ALERTS: { icon: IconName; title: string; time: string }[] = [
  { icon: 'checkmark-circle-outline', title: 'Your Griha Pravesh Puja is confirmed for 15 Oct.', time: '2h ago' },
  { icon: 'pricetag-outline', title: '15% off on all Festival Pujas this week.', time: '1d ago' },
  { icon: 'time-outline', title: 'Reminder: Satyanarayan Puja tomorrow at 10 AM.', time: '3d ago' },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ bookings: true, offers: true, reminders: true, newsletter: false });
  const toggle = (k: string) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <Screen>
      <ScreenHeader title="Notifications" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }}>
        <Text style={styles.section}>Preferences</Text>
        <View style={styles.card}>
          {PREFS.map((p, i) => (
            <View key={p.key} style={[styles.prefRow, i < PREFS.length - 1 && styles.divider]}>
              <View style={{ flex: 1, marginRight: spacing.md }}>
                <Text style={styles.prefLabel}>{p.label}</Text>
                <Text style={styles.prefSub}>{p.sub}</Text>
              </View>
              <Switch
                value={prefs[p.key]}
                onValueChange={() => toggle(p.key)}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.surfaceContainerHighest}
              />
            </View>
          ))}
        </View>

        <Text style={styles.section}>Recent</Text>
        {ALERTS.map((a, i) => (
          <View key={i} style={styles.alertRow}>
            <View style={styles.alertIcon}><Icon name={a.icon} size={18} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{a.title}</Text>
              <Text style={styles.alertTime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.titleMedium, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  prefRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  prefLabel: { ...typography.titleSmall, color: colors.textPrimary },
  prefSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  alertRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  alertIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  alertTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  alertTime: { ...typography.labelSmall, color: colors.textMuted, marginTop: 2 },
});
