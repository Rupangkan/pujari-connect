/**
 * Puja Detail Screen — Full puja information with booking flow
 * Ported from MyPandit's PujaDetailActivity.kt
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Dimensions, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Static detail data (will be replaced by API call using id from params)
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
  const puja = PUJA_DETAILS[id || ''] || DEFAULT_PUJA;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(puja.packages?.[0]?.id || null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);

  const pkg = puja.packages?.find((p: any) => p.id === selectedPackage);
  const offeringsTotal = puja.offerings?.filter((o: any) => selectedOfferings.includes(o.id)).reduce((s: number, o: any) => s + o.price, 0) || 0;
  const total = (pkg?.price || puja.basePrice) + offeringsTotal;

  const toggleOffering = (id: string) => {
    setSelectedOfferings(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#2D1408', '#1A0A00']} style={styles.hero}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.heroEmoji}>🪔</Text>
          <View style={styles.heroBadgeRow}>
            <View style={styles.typeBadge}><Text style={styles.typeBadgeText}>{puja.type}</Text></View>
            <View style={styles.catBadge}><Text style={styles.catBadgeText}>{puja.category}</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Title and meta */}
          <Text style={styles.title}>{puja.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>⏱ {Math.floor(puja.duration / 60) > 0 ? `${Math.floor(puja.duration / 60)}h ` : ''}{puja.duration % 60 > 0 ? `${puja.duration % 60}m` : ''}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaItem}>📅 {puja.dateTime}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaItem}>📍 {puja.location}</Text>
          </View>
          <Text style={styles.description}>{puja.description}</Text>

          {/* About */}
          <Text style={styles.sectionTitle}>About this Puja</Text>
          <Text style={styles.about}>{puja.aboutPuja}</Text>

          {/* Packages */}
          {puja.packages?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Select Package</Text>
              {puja.packages.map((pkg: any) => (
                <Pressable
                  key={pkg.id}
                  onPress={() => setSelectedPackage(pkg.id)}
                  style={[styles.packageCard, selectedPackage === pkg.id && styles.packageCardSelected]}
                >
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageTitle}>{pkg.title}</Text>
                    {pkg.isPopular && <View style={styles.popularBadge}><Text style={styles.popularText}>Most Popular</Text></View>}
                  </View>
                  <Text style={styles.packagePrice}>₹{pkg.price.toLocaleString('en-IN')}</Text>
                  {pkg.coupon && <Text style={styles.coupon}>🏷️ Use code: {pkg.coupon}</Text>}
                  {pkg.details?.map((d: any, di: number) => (
                    <View key={di} style={styles.packageDetail}>
                      <Text style={styles.detailHeading}>{d.heading} · <Text style={styles.detailLabel}>{d.label}</Text></Text>
                      {d.items.map((item: string, ii: number) => (
                        <Text key={ii} style={styles.detailItem}>✓ {item}</Text>
                      ))}
                    </View>
                  ))}
                  <View style={[styles.packageRadio, selectedPackage === pkg.id && styles.packageRadioSelected]}>
                    {selectedPackage === pkg.id && <View style={styles.packageRadioInner} />}
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {/* Offerings */}
          {puja.offerings?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Add Offerings (Optional)</Text>
              {puja.offerings.map((o: any) => (
                <Pressable
                  key={o.id}
                  onPress={() => toggleOffering(o.id)}
                  style={[styles.offeringRow, selectedOfferings.includes(o.id) && styles.offeringRowSelected]}
                >
                  <View style={[styles.checkbox, selectedOfferings.includes(o.id) && styles.checkboxSelected]}>
                    {selectedOfferings.includes(o.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.offeringName}>{o.name}</Text>
                  <Text style={styles.offeringPrice}>₹{o.price}</Text>
                </Pressable>
              ))}
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
                    <Text style={styles.faqChevron}>{expandedFaq === i ? '▲' : '▼'}</Text>
                  </View>
                  {expandedFaq === i && <Text style={styles.faqA}>{faq.answer}</Text>}
                </Pressable>
              ))}
            </>
          )}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <LinearGradient colors={['transparent', colors.background, colors.background]} style={styles.bottomBar} pointerEvents="box-none">
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.startingFrom}>Total Amount</Text>
            <Text style={styles.totalPrice}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.bookNowBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/booking/cart')}
          >
            <Text style={styles.bookNowText}>Book Now</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { height: 240, alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 56, left: spacing.lg, padding: spacing.sm },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  heroEmoji: { fontSize: 64 },
  heroBadgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  typeBadge: { backgroundColor: 'rgba(255,121,44,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(255,121,44,0.4)' },
  typeBadgeText: { ...typography.badge, color: colors.primary },
  catBadge: { backgroundColor: 'rgba(6,193,103,0.15)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(6,193,103,0.3)' },
  catBadgeText: { ...typography.badge, color: colors.success },
  body: { padding: spacing.lg },
  title: { ...typography.displayMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, flexWrap: 'wrap' },
  metaItem: { ...typography.bodySmall, color: colors.textSecondary },
  metaDot: { color: colors.textMuted, marginHorizontal: spacing.xs },
  description: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  sectionTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },
  about: { ...typography.bodyMedium, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.lg },
  // Package
  packageCard: { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.cardBorder, position: 'relative' },
  packageCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255,121,44,0.06)' },
  packageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  packageTitle: { ...typography.titleLarge, color: colors.textPrimary, flex: 1 },
  popularBadge: { backgroundColor: 'rgba(255,121,44,0.2)', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  popularText: { ...typography.badge, color: colors.primary, fontSize: 9 },
  packagePrice: { ...typography.price, color: colors.accentYellow, marginBottom: spacing.sm },
  coupon: { ...typography.labelSmall, color: colors.success, marginBottom: spacing.sm },
  packageDetail: { marginTop: spacing.sm },
  detailHeading: { ...typography.titleSmall, color: colors.textSecondary, marginBottom: 4 },
  detailLabel: { color: colors.primary },
  detailItem: { ...typography.bodySmall, color: colors.textMuted, marginLeft: spacing.sm, marginBottom: 2 },
  packageRadio: { position: 'absolute', top: spacing.lg, right: spacing.lg, width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  packageRadioSelected: { borderColor: colors.primary },
  packageRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  // Offerings
  offeringRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.cardBg, borderRadius: borderRadius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  offeringRowSelected: { borderColor: colors.success, backgroundColor: 'rgba(6,193,103,0.06)' },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.cardBorder, marginRight: spacing.md, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: colors.success, borderColor: colors.success },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  offeringName: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  offeringPrice: { ...typography.titleSmall, color: colors.accentYellow },
  // FAQ
  faqItem: { backgroundColor: colors.cardBg, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  faqQuestion: { flexDirection: 'row', alignItems: 'flex-start' },
  faqQ: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1, fontWeight: '600' },
  faqChevron: { color: colors.textMuted, fontSize: 12, marginLeft: spacing.sm, marginTop: 2 },
  faqA: { ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 18 },
  // Bottom CTA
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl, paddingHorizontal: spacing.lg },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  startingFrom: { ...typography.labelSmall, color: colors.textMuted },
  totalPrice: { ...typography.displayMedium, color: colors.accentYellow, fontSize: 22 },
  bookNowBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.xxxl, paddingVertical: spacing.lg, borderRadius: borderRadius.xl },
  bookNowText: { ...typography.button, color: '#fff', fontSize: 16 },
});
