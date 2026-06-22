/**
 * Payment Screen — Final booking confirmation & mock payment
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

const PAYMENT_METHODS = [
  { id: 'upi' as const, icon: '📱', label: 'UPI / PhonePe / GPay', sublabel: 'Pay via any UPI app' },
  { id: 'card' as const, icon: '💳', label: 'Credit / Debit Card', sublabel: 'Visa, Mastercard, Amex' },
  { id: 'netbanking' as const, icon: '🏦', label: 'Net Banking', sublabel: 'All major banks supported' },
  { id: 'cod' as const, icon: '💵', label: 'Cash on Delivery', sublabel: 'Pay when pandit arrives' },
];

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Static order summary (will come from bookingStore in production)
  const orderSummary = {
    pujaName: 'Griha Pravesh Puja',
    package: 'Premium Package',
    subtotal: 8500,
    discount: 0,
    total: 8500,
    address: '42, Divine Residency, Koramangala, Bangalore - 560001',
    date: 'Today + 2 days',
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your {orderSummary.pujaName} has been successfully booked.
            Our pandit will contact you shortly.
          </Text>
          <View style={styles.successCard}>
            <Text style={styles.successCardTitle}>Booking Details</Text>
            {[
              { label: 'Puja', value: orderSummary.pujaName },
              { label: 'Package', value: orderSummary.package },
              { label: 'Date', value: orderSummary.date },
              { label: 'Amount Paid', value: `₹${orderSummary.total.toLocaleString()}` },
              { label: 'Payment', value: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || '' },
            ].map((row, i) => (
              <View key={i} style={styles.successRow}>
                <Text style={styles.successLabel}>{row.label}</Text>
                <Text style={styles.successValue}>{row.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.successBtns}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={styles.homeBtn}
            >
              <Text style={styles.homeBtnText}>Go to Home</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={styles.bookingsBtn}
            >
              <Text style={styles.bookingsBtnText}>My Bookings →</Text>
            </Pressable>
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Puja</Text>
            <Text style={styles.summaryValue}>{orderSummary.pujaName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Package</Text>
            <Text style={styles.summaryValue}>{orderSummary.package}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Address</Text>
            <Text style={[styles.summaryValue, styles.addressValue]} numberOfLines={2}>{orderSummary.address}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{orderSummary.total.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Payment methods */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {PAYMENT_METHODS.map((method, idx) => (
            <Pressable
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={[styles.paymentCard, selectedMethod === method.id && styles.paymentCardSelected]}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <View style={styles.paymentLabel}>
                <Text style={styles.paymentName}>{method.label}</Text>
                <Text style={styles.paymentSublabel}>{method.sublabel}</Text>
              </View>
              <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]}>
                {selectedMethod === method.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}
        </Animated.View>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustBadge}><Text style={styles.trustText}>🔒 Secure Payment</Text></View>
          <View style={styles.trustBadge}><Text style={styles.trustText}>✓ 100% Safe</Text></View>
          <View style={styles.trustBadge}><Text style={styles.trustText}>💳 PCI DSS</Text></View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Pay button */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={handlePayment}
          disabled={isProcessing}
          style={({ pressed }) => [styles.payBtn, pressed && { opacity: 0.85 }]}
        >
          {isProcessing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={[styles.payBtnText, { marginLeft: spacing.sm }]}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payBtnText}>
              Pay ₹{orderSummary.total.toLocaleString()} →
            </Text>
          )}
        </Pressable>
        <Text style={styles.termsNote}>
          By paying, you agree to our Terms & Refund Policy
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: { marginRight: spacing.md },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.lg },
  // Summary
  summaryCard: { backgroundColor: colors.cardBg, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder },
  summaryTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm, alignItems: 'flex-start' },
  summaryLabel: { ...typography.bodySmall, color: colors.textMuted, flex: 1 },
  summaryValue: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1.5, textAlign: 'right' },
  addressValue: { fontSize: 12 },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: spacing.md, marginTop: spacing.sm },
  totalLabel: { ...typography.titleMedium, color: colors.textPrimary },
  totalValue: { ...typography.price, color: colors.accentYellow },
  // Payment methods
  sectionTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  paymentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1.5, borderColor: colors.cardBorder },
  paymentCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255,121,44,0.06)' },
  paymentIcon: { fontSize: 24, marginRight: spacing.md },
  paymentLabel: { flex: 1 },
  paymentName: { ...typography.titleSmall, color: colors.textPrimary },
  paymentSublabel: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  // Trust
  trustRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' },
  trustBadge: { backgroundColor: 'rgba(6,193,103,0.1)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(6,193,103,0.2)' },
  trustText: { ...typography.labelSmall, color: colors.success },
  // Bottom
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surfaceContainerHighest, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  payBtn: { backgroundColor: colors.success, paddingVertical: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center', marginBottom: spacing.sm },
  processingRow: { flexDirection: 'row', alignItems: 'center' },
  payBtnText: { ...typography.button, color: '#fff', fontSize: 16 },
  termsNote: { ...typography.labelSmall, color: colors.textMuted, textAlign: 'center' },
  // Success state
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(6,193,103,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, borderWidth: 2, borderColor: 'rgba(6,193,103,0.3)' },
  successEmoji: { fontSize: 48 },
  successTitle: { ...typography.displayMedium, color: colors.success, marginBottom: spacing.md, textAlign: 'center' },
  successSubtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 22 },
  successCard: { width: '100%', backgroundColor: colors.cardBg, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: spacing.xl },
  successCardTitle: { ...typography.titleMedium, color: colors.textPrimary, marginBottom: spacing.md },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  successLabel: { ...typography.bodySmall, color: colors.textMuted },
  successValue: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right' },
  successBtns: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  homeBtn: { flex: 1, backgroundColor: colors.cardBg, paddingVertical: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  homeBtnText: { ...typography.button, color: colors.textPrimary },
  bookingsBtn: { flex: 1, backgroundColor: colors.success, paddingVertical: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center' },
  bookingsBtnText: { ...typography.button, color: '#fff' },
});
