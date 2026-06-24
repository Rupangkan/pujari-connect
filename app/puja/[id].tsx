/**
 * Puja Detail Screen — full puja information with booking flow. Light theme.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';

const PUJA_DETAILS: Record<string, any> = {
  '1': {
    name: 'Griha Pravesh Puja',
    description: 'Welcome positive energies into your new home with the sacred Griha Pravesh Puja. This traditional Hindu ceremony is performed to purify the space, ward off negative influences, and ensure peace, prosperity, and happiness for the residing family.',
    aboutPuja: 'Griha Pravesh Puja is a Hindu ceremony performed on the occasion of an individual\'s first time entering their new home. The puja is believed to cleanse the new house of any negative energies.',
    type: 'OFFLINE', duration: 120, dateTime: 'Book Anytime', basePrice: 5100, category: 'HOME', location: 'At Your Home',
    packages: [
      { id: 'p1', title: 'Basic Package', price: 5100, isPopular: false, details: [{ heading: 'Rituals', label: 'Included', items: ['Ganesh Puja', 'Vastu Puja', 'Havan'] }] },
      { id: 'p2', title: 'Premium Package', price: 8500, coupon: 'GRIHA20', isPopular: true, details: [{ heading: 'Rituals', label: 'All', items: ['Ganesh Puja', 'Vastu Puja', 'Navagraha Puja', 'Havan', 'Lakshmi Puja'] }, { heading: 'Extras', label: 'Bonus', items: ['Video Recording', 'Prasad Delivery', 'Vastu Consultation'] }] },
      { id: 'p3', title: 'Royal Package', price: 15000, isPopular: false, details: [{ heading: 'Rituals', label: 'All-Inclusive', items: ['All Premium rituals', 'Rudrabhishek', 'Satyanarayan Puja'] }] },
    ],
    offerings: [
      { id: 'o1', name: 'Special Prasad Delivery', price: 251 },
      { id: 'o2', name: 'Additional Aarti', price: 151 },
      { id: 'o3', name: 'Dakshina for Pandit', price: 501 },
    ],
    faqs: [
      { question: 'Why choose MyPujari?', answer: 'MyPujari provides authenticated and traditional rituals performed by verified pandits with years of experience.' },
      { question: 'Who will perform the Puja?', answer: 'The Puja will be performed by qualified and verified Pandits from our team.' },
      { question: 'What is included?', answer: 'Complete rituals as per Vedic traditions: Sankalp, mantra chanting, offerings, Aarti, and Prasad distribution.' },
      { question: 'Can I reschedule?', answer: 'You can reschedule up to 24 hours before the scheduled time without any charges.' },
    ],
  },
};

const DEFAULT_PUJA = {
  name: 'Satyanarayan Puja', description: 'The Satyanarayan Puja is a revered ritual dedicated to Lord Vishnu in his form as Satyanarayan.',
  aboutPuja: 'Satyanarayan Puja is a popular Hindu ritual dedicated to Lord Vishnu.',
  type: 'BOTH', duration: 90, dateTime: 'Daily', basePrice: 3500, category: 'PERSONAL', location: 'Kashi / Online',
  packages: [
    { id: 'p1', title: 'Standard Package', price: 3500, isPopular: true, details: [{ heading: 'Rituals', label: 'Included', items: ['Ganesh Puja', 'Satyanarayan Katha', 'Aarti'] }] },
  ],
  offerings: [
    { id: 'o1', name: 'Special Prasad Delivery', price: 251 },
    { id: 'o2', name: 'Additional Aarti', price: 151 },
  ],
  faqs: [
    { question: 'Why choose MyPujari?', answer: 'We provide authenticated and traditional rituals performed by verified pandits.' },
    { question: 'Who will perform the Puja?', answer: 'Qualified and verified Pandits from our team.' },
  ],
};

export default function PujaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const puja = PUJA_DETAILS[id || ''] || DEFAULT_PUJA;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(puja.packages?.[0]?.id || null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);

  const pkg = puja.packages?.find((p: any) => p.id === selectedPackage);
  const offeringsTotal = puja.offerings?.filter((o: any) => selectedOfferings.includes(o.id)).reduce((s: number, o: any) => s + o.price, 0) || 0;
  const total = (pkg?.price || puja.basePrice) + offeringsTotal;

  const toggleOffering = (oid: string) => {
    setSelectedOfferings(prev => prev.includes(oid) ? prev.filter(i => i !== oid) : [...prev, oid]);
  };

  const hours = Math.floor(puja.duration / 60);
  const mins = puja.duration % 60;
  const durationLabel = `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`.trim();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <LinearGradient colors={colors.gradientAarti} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + spacing.sm }]} hitSlop={8}>
            <Icon name="arrow-back" size={22} color={colors.maroon} />
          </Pressable>
          <Icon name="flame" size={56} color="rgba(122,31,43,0.32)" />
          <View style={styles.heroBadgeRow}>
            <View style={styles.typeBadge}><Text style={styles.typeBadgeText}>{puja.type}</Text></View>
            <View style={styles.catBadge}><Text style={styles.catBadgeText}>{puja.category}</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.title}>{puja.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}><Icon name="time-outline" size={14} color={colors.textMuted} /><Text style={styles.metaText}>{durationLabel}</Text></View>
            <View style={styles.metaItem}><Icon name="calendar-outline" size={14} color={colors.textMuted} /><Text style={styles.metaText}>{puja.dateTime}</Text></View>
            <View style={styles.metaItem}><Icon name="location-outline" size={14} color={colors.textMuted} /><Text style={styles.metaText}>{puja.location}</Text></View>
          </View>
          <Text style={styles.description}>{puja.description}</Text>

          <Text style={styles.sectionTitle}>About this Puja</Text>
          <Text style={styles.about}>{puja.aboutPuja}</Text>

          {/* Packages */}
          {puja.packages?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Select Package</Text>
              {puja.packages.map((p: any) => {
                const active = selectedPackage === p.id;
                return (
                  <Pressable key={p.id} onPress={() => setSelectedPackage(p.id)} style={[styles.packageCard, active && styles.packageCardSelected]}>
                    <View style={styles.packageContent}>
                      <View style={styles.packageHeader}>
                        <Text style={styles.packageTitle}>{p.title}</Text>
                        {p.isPopular && <View style={styles.popularBadge}><Text style={styles.popularText}>POPULAR</Text></View>}
                      </View>
                      <Text style={styles.packagePrice}>₹{p.price.toLocaleString('en-IN')}</Text>
                      {p.coupon && (
                        <View style={styles.couponRow}>
                          <Icon name="pricetag-outline" size={13} color={colors.success} />
                          <Text style={styles.coupon}>Use code: {p.coupon}</Text>
                        </View>
                      )}
                      {p.details?.map((d: any, di: number) => (
                        <View key={di} style={styles.packageDetail}>
                          <Text style={styles.detailHeading}>{d.heading} · <Text style={styles.detailLabel}>{d.label}</Text></Text>
                          {d.items.map((item: string, ii: number) => (
                            <View key={ii} style={styles.detailItemRow}>
                              <Icon name="checkmark" size={13} color={colors.success} />
                              <Text style={styles.detailItem}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                    <View style={[styles.radio, active && styles.radioSelected]}>
                      {active && <View style={styles.radioInner} />}
                    </View>
                  </Pressable>
                );
              })}
            </>
          )}

          {/* Offerings */}
          {puja.offerings?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Add Offerings (Optional)</Text>
              {puja.offerings.map((o: any) => {
                const on = selectedOfferings.includes(o.id);
                return (
                  <Pressable key={o.id} onPress={() => toggleOffering(o.id)} style={[styles.offeringRow, on && styles.offeringRowSelected]}>
                    <View style={[styles.checkbox, on && styles.checkboxSelected]}>
                      {on && <Icon name="checkmark" size={14} color={colors.textOnPrimary} />}
                    </View>
                    <Text style={styles.offeringName}>{o.name}</Text>
                    <Text style={styles.offeringPrice}>₹{o.price}</Text>
                  </Pressable>
                );
              })}
            </>
          )}

          {/* FAQs */}
          {puja.faqs?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {puja.faqs.map((faq: any, i: number) => (
                <Pressable key={i} onPress={() => setExpandedFaq(expandedFaq === i ? null : i)} style={styles.faqItem}>
                  <View style={styles.faqQuestion}>
                    <Text style={styles.faqQ}>{faq.question}</Text>
                    <Icon name={expandedFaq === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
                  </View>
                  {expandedFaq === i && <Text style={styles.faqA}>{faq.answer}</Text>}
                </Pressable>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View>
          <Text style={styles.startingFrom}>Total Amount</Text>
          <Text style={styles.totalPrice}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.bookNowBtn, pressed && { opacity: 0.85 }]} onPress={() => router.push('/booking/cart')}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: 230, alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', left: spacing.lg, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  heroBadgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  typeBadge: { backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  typeBadgeText: { ...typography.badge, color: colors.maroon },
  catBadge: { backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  catBadgeText: { ...typography.badge, color: colors.maroon },
  body: { padding: spacing.lg },
  title: { ...typography.displayMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.bodySmall, color: colors.textSecondary },
  description: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 22 },
  sectionTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.xxl },
  about: { ...typography.bodyMedium, color: colors.textMuted, lineHeight: 22 },
  // Package
  packageCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.cardBorder },
  packageCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(242,112,10,0.05)' },
  packageContent: { flex: 1, paddingRight: spacing.md },
  packageHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  packageTitle: { ...typography.titleLarge, color: colors.textPrimary, flexShrink: 1 },
  popularBadge: { backgroundColor: 'rgba(242,112,10,0.14)', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  popularText: { ...typography.badge, color: colors.primary, fontSize: 9 },
  packagePrice: { ...typography.price, color: colors.primary, marginBottom: spacing.xs },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm },
  coupon: { ...typography.labelSmall, color: colors.success },
  packageDetail: { marginTop: spacing.sm },
  detailHeading: { ...typography.titleSmall, color: colors.textSecondary, marginBottom: 4 },
  detailLabel: { color: colors.primary },
  detailItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  detailItem: { ...typography.bodySmall, color: colors.textMuted },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  // Offerings
  offeringRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  offeringRowSelected: { borderColor: colors.success, backgroundColor: 'rgba(22,163,74,0.05)' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.cardBorderLight, marginRight: spacing.md, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: colors.success, borderColor: colors.success },
  offeringName: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  offeringPrice: { ...typography.titleSmall, color: colors.primary },
  // FAQ
  faqItem: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  faqQ: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1, fontWeight: '600' },
  faqA: { ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 18 },
  // Bottom CTA
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: spacing.md, paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.cardBorderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  startingFrom: { ...typography.labelSmall, color: colors.textMuted },
  totalPrice: { ...typography.displayMedium, color: colors.primary, fontSize: 22 },
  bookNowBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.xxxl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  bookNowText: { ...typography.button, color: '#fff', fontSize: 16 },
});
