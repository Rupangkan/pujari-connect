/**
 * Terms & Privacy — legal text. Light theme.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

const SECTIONS = [
  {
    title: 'Terms of Service',
    body: 'By using Pujari Connect you agree to book ritual services through verified pandits listed on the platform. Bookings are subject to pandit availability. Prices shown include the listed package; optional offerings are charged separately. You are responsible for providing accurate address and contact details for in-person services.',
  },
  {
    title: 'Bookings & Cancellations',
    body: 'You may reschedule or cancel a booking up to 24 hours before the scheduled time at no charge. Cancellations within 24 hours may incur a fee. Pujari Connect is not liable for delays caused by incorrect information or circumstances beyond our control.',
  },
  {
    title: 'Payments & Refunds',
    body: 'Payments are processed securely through our payment partners. Eligible refunds are returned to the original payment method within 5–7 business days. Cash on Delivery is available for select services.',
  },
  {
    title: 'Privacy Policy',
    body: 'We collect your name, phone number, email and address solely to fulfil bookings and deliver samagri. We do not sell your personal data. Information is shared only with the assigned pandit and delivery partners as needed to complete your order.',
  },
  {
    title: 'Data & Security',
    body: 'Your data is stored securely and protected with industry-standard measures. You may request deletion of your account and associated data at any time by contacting support.',
  },
];

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <ScreenHeader title="Terms & Privacy" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }}>
        <Text style={styles.updated}>Last updated: 1 June 2026</Text>
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.block}>
            <Text style={styles.heading}>{s.title}</Text>
            <Text style={styles.body}>{s.body}</Text>
          </View>
        ))}
        <Text style={styles.footer}>© 2026 Pujari Connect. All rights reserved.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  updated: { ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
  block: { marginBottom: spacing.xl },
  heading: { ...typography.titleMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  body: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 22 },
  footer: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
