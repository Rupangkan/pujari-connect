/**
 * Pujari Detail Screen — full pujari profile with booking options. Light theme.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Pujari } from '@/types';

const PUJARI_DATA: Record<string, Pujari> = {
  '1': { id: '1', name: 'Pandit Rajesh Sharma', experience: 15, ethnicity: 'Hindi', specialization: 'Griha Pravesh, Wedding Ceremonies', phone: '+91-9876543210', email: 'rajesh@mypujari.com', location: 'Guwahati, Assam', rating: 4.8, totalBookings: 523, hourlyRate: 1500, bio: 'Pandit Rajesh Sharma is an expert in Vedic rituals with over 15 years of dedicated service. He specializes in home pujas and wedding ceremonies, bringing authentic traditions to every ritual he performs. Trained at the prestigious Kashi Vidwat Parishad, he is well versed in all major Hindu scriptures and rituals.', languages: 'Hindi, English, Assamese', isVerified: true },
  '2': { id: '2', name: 'Swami Bishal Nayan Das', experience: 25, ethnicity: 'Bengali', specialization: 'Pitru Shanti, Satyanarayan Puja', phone: '+91-9876543211', email: 'bishal@mypujari.com', location: 'Guwahati, Assam', rating: 4.9, totalBookings: 1247, hourlyRate: 2000, bio: 'Swami Bishal Nayan Das is a renowned scholar of Vedic scriptures with 25 years of spiritual experience. He performs authentic traditional rituals with deep spiritual understanding, having studied at Belur Math. His expertise in ancestral rituals and Pitru Shanti ceremonies is unmatched in the region.', languages: 'Bengali, Hindi, English, Sanskrit', isVerified: true },
  '3': { id: '3', name: 'Pandit Suresh Joshi', experience: 10, ethnicity: 'Assamese', specialization: 'Festival Pujas, Lakshmi Puja', phone: '+91-9876543212', email: 'suresh@mypujari.com', location: 'Guwahati, Assam', rating: 4.6, totalBookings: 345, hourlyRate: 1200, bio: 'Pandit Suresh Joshi brings a fresh and energetic approach to traditional rituals while maintaining complete authenticity. Being from Guwahati, he has deep knowledge of Assamese traditions and the specific rituals practiced in Northeast India.', languages: 'Assamese, Hindi, English', isVerified: true },
  '4': { id: '4', name: 'Acharya Ramakrishna Iyer', experience: 30, ethnicity: 'Tamil', specialization: 'Temple Pujas, Homam', phone: '+91-9876543213', email: 'ramakrishna@mypujari.com', location: 'Guwahati, Assam', rating: 4.9, totalBookings: 2156, hourlyRate: 2500, bio: 'Acharya Ramakrishna Iyer is a senior priest with 30 years of extensive knowledge of South Indian temple traditions and Agama Shastra. He has performed thousands of Homams and special temple rituals across India and is especially revered for his mastery of Rudrabhishek and Vishnu Sahasranama recitation.', languages: 'Tamil, Telugu, Sanskrit, English, Kannada', isVerified: true },
};

const DEFAULT_PUJARI: Pujari = PUJARI_DATA['1'];

const PACKAGES = [
  { id: 'pkg1', name: 'Basic Puja', duration: '2 Hours', price: 2000, description: 'Standard home puja with all essential rituals' },
  { id: 'pkg2', name: 'Extended Ceremony', duration: '4 Hours', price: 3500, description: 'Full ceremony with havan and extended rituals', popular: true },
  { id: 'pkg3', name: 'Full Day Ceremony', duration: '8 Hours', price: 6000, description: 'Complete all-day ritual for major occasions' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name={i <= Math.round(rating) ? 'star' : 'star-outline'} size={15} color={colors.starFilled} />
      ))}
      <Text style={starStyles.label}> {rating.toFixed(1)}</Text>
    </View>
  );
}
const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  label: { ...typography.labelMedium, color: colors.textSecondary, marginLeft: 4 },
});

export default function PujariDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const pujari = PUJARI_DATA[id || ''] || DEFAULT_PUJARI;
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  const details: { icon: IconName; label: string; value: string }[] = [
    { icon: 'location-outline', label: 'Location', value: pujari.location },
    { icon: 'language-outline', label: 'Languages', value: pujari.languages },
    { icon: 'call-outline', label: 'Contact', value: pujari.phone },
    { icon: 'mail-outline', label: 'Email', value: pujari.email },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <LinearGradient colors={colors.gradientAarti} style={[styles.hero, { paddingTop: insets.top + spacing.huge }]}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + spacing.sm }]} hitSlop={8}>
            <Icon name="arrow-back" size={22} color={colors.maroon} />
          </Pressable>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{pujari.name.charAt(0)}</Text>
            </View>
            {pujari.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={13} color={colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{pujari.name}</Text>
          <Text style={styles.specialization}>{pujari.specialization}</Text>
          <StarRating rating={pujari.rating} />
          <View style={styles.ethnicityBadge}>
            <Text style={styles.ethnicityText}>{pujari.ethnicity} Tradition</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.statsRow}>
          {[
            { label: 'Experience', value: `${pujari.experience} yrs` },
            { label: 'Bookings', value: pujari.totalBookings.toLocaleString('en-IN') },
            { label: 'Rating', value: pujari.rating.toFixed(1) },
            { label: 'Rate/hr', value: `₹${pujari.hourlyRate.toLocaleString('en-IN')}` },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{pujari.bio}</Text>

          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            {details.map((d, i) => (
              <View key={i} style={styles.detailItem}>
                <View style={styles.detailIconWrap}><Icon name={d.icon} size={18} color={colors.primary} /></View>
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{d.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Packages */}
          <Text style={styles.sectionTitle}>Select Package</Text>
          {PACKAGES.map(pkg => {
            const active = selectedPkg === pkg.id;
            return (
              <Pressable key={pkg.id} onPress={() => setSelectedPkg(pkg.id)} style={[styles.pkgCard, active && styles.pkgCardSelected]}>
                <View style={styles.pkgContent}>
                  {pkg.popular && (
                    <View style={styles.popularBadge}>
                      <Icon name="star" size={11} color={colors.primary} />
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}
                  <View style={styles.pkgHeader}>
                    <Text style={styles.pkgName}>{pkg.name}</Text>
                    <Text style={styles.pkgPrice}>₹{pkg.price.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.pkgDurationRow}>
                    <Icon name="time-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.pkgDuration}>{pkg.duration}</Text>
                  </View>
                  <Text style={styles.pkgDesc}>{pkg.description}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioSelected]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          {[
            { name: 'Priya S.', rating: 5, text: 'Excellent service! Very knowledgeable and performed the puja with great devotion.', date: '2 days ago' },
            { name: 'Rahul M.', rating: 5, text: 'Professional and punctual. The rituals were performed exactly as per tradition.', date: '1 week ago' },
            { name: 'Anita B.', rating: 4, text: 'Very good experience. Explained every ritual in detail. Highly recommended!', date: '2 weeks ago' },
          ].map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarText}>{r.name.charAt(0)}</Text></View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <View style={styles.reviewRating}>
                    {Array.from({ length: r.rating }).map((_, si) => (
                      <Icon key={si} name="star" size={11} color={colors.starFilled} />
                    ))}
                    <Text style={styles.reviewDate}> · {r.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaLabel}>
            {selectedPkg
              ? `₹${(PACKAGES.find(p => p.id === selectedPkg)?.price || 0).toLocaleString('en-IN')}`
              : `From ₹${pujari.hourlyRate.toLocaleString('en-IN')}/hr`}
          </Text>
          <Text style={styles.ctaSublabel}>{selectedPkg ? 'Package selected' : 'Select a package above'}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85 }]} onPress={() => router.push('/puja/1')}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // Hero
  hero: { paddingBottom: spacing.xl, alignItems: 'center' },
  backBtn: { position: 'absolute', left: spacing.lg, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  avatarContainer: { alignItems: 'center', marginBottom: spacing.md },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.displayLarge, color: colors.primary, fontSize: 36 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(22,163,74,0.3)' },
  verifiedText: { ...typography.badge, color: colors.success },
  name: { ...typography.headlineLarge, color: colors.textPrimary, marginBottom: 4, textAlign: 'center' },
  specialization: { ...typography.bodyMedium, color: colors.textSecondary, marginBottom: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xxl },
  ethnicityBadge: { marginTop: spacing.sm, backgroundColor: 'rgba(255,255,255,0.65)', paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.hairlineGold },
  ethnicityText: { ...typography.labelMedium, color: colors.maroon, fontWeight: '600' },
  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: -spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder, shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 3 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.headlineSmall, color: colors.primary, marginBottom: 2 },
  statLabel: { ...typography.labelSmall, color: colors.textMuted },
  // Body
  body: { padding: spacing.lg },
  sectionTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginTop: spacing.xxl, marginBottom: spacing.md },
  bio: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 24 },
  // Details
  detailsGrid: { gap: spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder },
  detailIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  detailText: { flex: 1 },
  detailLabel: { ...typography.labelSmall, color: colors.textMuted },
  detailValue: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  // Packages
  pkgCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.cardBorder },
  pkgCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(242,112,10,0.05)' },
  pkgContent: { flex: 1, paddingRight: spacing.md },
  popularBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(242,112,10,0.14)', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm, marginBottom: spacing.sm, alignSelf: 'flex-start' },
  popularText: { ...typography.badge, color: colors.primary, fontSize: 10 },
  pkgHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  pkgName: { ...typography.titleMedium, color: colors.textPrimary, flexShrink: 1 },
  pkgPrice: { ...typography.price, color: colors.primary, fontSize: 16 },
  pkgDurationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, marginBottom: spacing.xs },
  pkgDuration: { ...typography.bodySmall, color: colors.textMuted },
  pkgDesc: { ...typography.bodySmall, color: colors.textMuted },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  // Reviews
  reviewCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(242,112,10,0.10)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  reviewAvatarText: { ...typography.titleSmall, color: colors.primary },
  reviewMeta: { flex: 1 },
  reviewName: { ...typography.titleSmall, color: colors.textPrimary },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  reviewDate: { ...typography.labelSmall, color: colors.textMuted },
  reviewText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 18 },
  // Bottom CTA
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingTop: spacing.md, paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.cardBorderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  ctaLabel: { ...typography.headlineSmall, color: colors.primary },
  ctaSublabel: { ...typography.bodySmall, color: colors.textMuted },
  bookBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  bookBtnText: { ...typography.button, color: '#fff', fontSize: 16 },
});
