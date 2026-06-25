/**
 * Help & Support — contact options + FAQ accordion. Light theme.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Icon, type IconName } from '@/components/ui/Icon';

const CONTACTS: { icon: IconName; label: string; sub: string }[] = [
  { icon: 'call-outline', label: 'Call Us', sub: '+91 1800 123 4567' },
  { icon: 'mail-outline', label: 'Email', sub: 'support@pujariconnect.com' },
  { icon: 'chatbubble-ellipses-outline', label: 'Live Chat', sub: 'Available 24/7' },
];

const FAQS = [
  { q: 'How do I book a puja?', a: 'Browse pujas, open one, pick a package, choose your address and pay. A verified pandit is then assigned to you.' },
  { q: 'Can I reschedule or cancel?', a: 'Yes — up to 24 hours before the scheduled time with no charge from My Bookings.' },
  { q: 'Are the pandits verified?', a: 'Every pandit is identity-verified and rated by past customers before being listed.' },
  { q: 'How do refunds work?', a: 'Eligible cancellations are refunded to the original payment method within 5–7 business days.' },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Screen>
      <ScreenHeader title="Help & Support" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }}>
        <Text style={styles.section}>Get in Touch</Text>
        <View style={styles.contactRow}>
          {CONTACTS.map((c) => (
            <Pressable key={c.label} style={styles.contactCard}>
              <View style={styles.contactIcon}><Icon name={c.icon} size={20} color={colors.primary} /></View>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactSub} numberOfLines={1}>{c.sub}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Frequently Asked</Text>
        {FAQS.map((f, i) => (
          <Pressable key={i} onPress={() => setOpen(open === i ? null : i)} style={styles.faqItem}>
            <View style={styles.faqRow}>
              <Text style={styles.faqQ}>{f.q}</Text>
              <Icon name={open === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
            </View>
            {open === i && <Text style={styles.faqA}>{f.a}</Text>}
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.titleMedium, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  contactRow: { flexDirection: 'row', gap: spacing.md },
  contactCard: { flex: 1, alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingVertical: spacing.lg, paddingHorizontal: spacing.xs, borderWidth: 1, borderColor: colors.cardBorder },
  contactIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  contactLabel: { ...typography.labelMedium, color: colors.textPrimary, fontWeight: '600' },
  contactSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  faqItem: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  faqQ: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1, fontWeight: '600' },
  faqA: { ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 19 },
});
