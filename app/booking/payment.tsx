/**
 * Payment Screen — booking confirmation; creates a real booking. Light theme.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon, type IconName } from '@/components/ui/Icon';
import { EmptyView } from '@/components/ui/AsyncBoundary';
import { bookingService } from '@/services/booking.service';
import { formatINR } from '@/utils/mappers';
import { useBookingDraft } from '@/store/bookingDraft';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

const PAYMENT_METHODS: { id: PaymentMethod; icon: IconName; label: string; sublabel: string }[] = [
  { id: 'upi', icon: 'phone-portrait-outline', label: 'UPI / PhonePe / GPay', sublabel: 'Pay via any UPI app' },
  { id: 'card', icon: 'card-outline', label: 'Credit / Debit Card', sublabel: 'Visa, Mastercard, Amex' },
  { id: 'netbanking', icon: 'business-outline', label: 'Net Banking', sublabel: 'All major banks supported' },
  { id: 'cod', icon: 'cash-outline', label: 'Cash on Delivery', sublabel: 'Pay when pandit arrives' },
];

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const draft = useBookingDraft(s => s.draft);
  const clearDraft = useBookingDraft(s => s.clear);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!draft && !isSuccess) {
    return (
      <Screen>
        <EmptyView icon="cart-outline" title="No booking in progress" subtitle="Pick a puja or pujari to book." actionLabel="Browse Pujas" onAction={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  const handlePayment = async () => {
    if (!draft || isProcessing) return;
    setError('');
    setIsProcessing(true);
    try {
      const payload = {
        pujaId: draft.pujaId,
        pujariId: draft.pujariId,
        packageId: draft.packageId,
        addressId: draft.addressId,
        bookingDate: new Date().toISOString(),
        totalAmount: draft.total,
        offeringIds: draft.offeringIds,
        notes: draft.notes,
      };
      const res = await bookingService.create(payload as any);
      setBookingId((res.data as any).data?.id ?? null);
      setIsSuccess(true);
      clearDraft();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Screen>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.successContainer}>
          <View style={styles.successIcon}><Icon name="checkmark-circle" size={64} color={colors.success} /></View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>Your booking has been placed. Our team will contact you shortly.</Text>
          {!!bookingId && <Text style={styles.bookingRef}>Ref #{bookingId.slice(-8).toUpperCase()}</Text>}
          <View style={styles.successBtns}>
            <Pressable onPress={() => router.replace('/(tabs)')} style={styles.homeBtn}>
              <Text style={styles.homeBtnText}>Go to Home</Text>
            </Pressable>
            <Pressable onPress={() => router.replace('/booking/history')} style={styles.bookingsBtn}>
              <Text style={styles.bookingsBtnText}>My Bookings</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{draft!.kind === 'puja' ? 'Puja' : 'Pujari'}</Text>
            <Text style={styles.summaryValue}>{draft!.title}</Text>
          </View>
          {!!draft!.subtitle && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package</Text>
              <Text style={styles.summaryValue}>{draft!.subtitle}</Text>
            </View>
          )}
          {!!draft!.addressText && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Address</Text>
              <Text style={[styles.summaryValue, styles.addressValue]} numberOfLines={2}>{draft!.addressText}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatINR(draft!.total)}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {PAYMENT_METHODS.map((method) => {
            const active = selectedMethod === method.id;
            return (
              <Pressable key={method.id} onPress={() => setSelectedMethod(method.id)} style={[styles.paymentCard, active && styles.paymentCardSelected]}>
                <View style={styles.payIconWrap}><Icon name={method.icon} size={20} color={colors.primary} /></View>
                <View style={styles.paymentLabel}>
                  <Text style={styles.paymentName}>{method.label}</Text>
                  <Text style={styles.paymentSublabel}>{method.sublabel}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioSelected]}>{active && <View style={styles.radioInner} />}</View>
              </Pressable>
            );
          })}
        </Animated.View>

        <View style={styles.trustRow}>
          {([['lock-closed', 'Secure'], ['shield-checkmark', '100% Safe'], ['card', 'PCI DSS']] as [IconName, string][]).map(([ic, t]) => (
            <View key={t} style={styles.trustBadge}>
              <Icon name={ic} size={13} color={colors.success} />
              <Text style={styles.trustText}>{t}</Text>
            </View>
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
        <View style={{ height: 150 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Pressable onPress={handlePayment} disabled={isProcessing} style={({ pressed }) => [styles.payBtn, pressed && { opacity: 0.85 }]}>
          {isProcessing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator color={colors.textOnPrimary} size="small" />
              <Text style={[styles.payBtnText, { marginLeft: spacing.sm }]}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payBtnText}>Pay {formatINR(draft!.total)}</Text>
          )}
        </Pressable>
        <Text style={styles.termsNote}>By paying, you agree to our Terms & Refund Policy</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.lg },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder },
  summaryTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm, alignItems: 'flex-start', gap: spacing.lg },
  summaryLabel: { ...typography.bodySmall, color: colors.textMuted, flex: 1 },
  summaryValue: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1.5, textAlign: 'right', fontWeight: '600' },
  addressValue: { fontSize: 12, fontWeight: '400' },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: spacing.md, marginTop: spacing.sm },
  totalLabel: { ...typography.titleMedium, color: colors.textPrimary },
  totalValue: { ...typography.price, color: colors.primary },
  sectionTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  paymentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1.5, borderColor: colors.cardBorder },
  paymentCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(242,112,10,0.05)' },
  payIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  paymentLabel: { flex: 1 },
  paymentName: { ...typography.titleSmall, color: colors.textPrimary },
  paymentSublabel: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  trustRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' },
  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(22,163,74,0.08)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)' },
  trustText: { ...typography.labelSmall, color: colors.success, fontWeight: '600' },
  errorText: { ...typography.bodySmall, color: colors.error, textAlign: 'center', marginTop: spacing.md },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, paddingTop: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cardBorderLight, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  payBtn: { backgroundColor: colors.success, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center', marginBottom: spacing.sm },
  processingRow: { flexDirection: 'row', alignItems: 'center' },
  payBtnText: { ...typography.button, color: colors.textOnPrimary, fontSize: 16 },
  termsNote: { ...typography.labelSmall, color: colors.textMuted, textAlign: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  successIcon: { width: 104, height: 104, borderRadius: 52, backgroundColor: 'rgba(22,163,74,0.10)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, borderWidth: 2, borderColor: 'rgba(22,163,74,0.25)' },
  successTitle: { ...typography.displayMedium, color: colors.success, marginBottom: spacing.md, textAlign: 'center' },
  successSubtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md, lineHeight: 22 },
  bookingRef: { ...typography.titleMedium, color: colors.textPrimary, marginBottom: spacing.xl },
  successBtns: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  homeBtn: { flex: 1, backgroundColor: colors.surface, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center', borderWidth: 1.5, borderColor: colors.cardBorderLight },
  homeBtnText: { ...typography.button, color: colors.textPrimary },
  bookingsBtn: { flex: 1, backgroundColor: colors.success, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center' },
  bookingsBtnText: { ...typography.button, color: colors.textOnPrimary },
});
