/**
 * Pujari Detail Screen — full pujari profile with booking options (live core data).
 * Packages and reviews are illustrative (not yet modelled in the backend).
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
import { LoadingView, ErrorView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujariService } from '@/services/pujari.service';
import { formatINR } from '@/utils/mappers';
import { Pujari } from '@/types';

const PACKAGES = [
  { id: 'pkg1', name: 'Basic Puja', duration: '2 Hours', price: 2000, description: 'Standard home puja with all essential rituals' },
  { id: 'pkg2', name: 'Extended Ceremony', duration: '4 Hours', price: 3500, description: 'Full ceremony with havan and extended rituals', popular: true },
  { id: 'pkg3', name: 'Full Day Ceremony', duration: '8 Hours', price: 6000, description: 'Complete all-day ritual for major occasions' },
];

const REVIEWS = [
  { name: 'Priya S.', rating: 5, text: 'Excellent service! Very knowledgeable and performed the puja with great devotion.', date: '2 days ago' },
  { name: 'Rahul M.', rating: 5, text: 'Professional and punctual. The rituals were performed exactly as per tradition.', date: '1 week ago' },
  { name: 'Anita B.', rating: 4, text: 'Very good experience. Explained every ritual in detail. Highly recommended!', date: '2 weeks ago' },
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
  const { data: pujari, loading, error, reload } = useApi<Pujari>(
    () => pujariService.getById(String(id)).then(r => (r.data as any).data as Pujari),
    [id]
  );
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  if (loading) return <View style={styles.container}><LoadingView /></View>;
  if (error || !pujari) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + spacing.sm }]} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <ErrorView message={error || 'Pujari not found.'} onRetry={reload} />
      </View>
    );
  }

  const details: { icon: IconName; label: string; value: string }[] = [
    { icon: 'location-outline', label: 'Location', value: pujari.location },
    { icon: 'language-outline', label: 'Languages', value: pujari.languages },
    { icon: 'call-outline', label: 'Contact', value: pujari.phone },
    { icon: 'mail-outline', label: 'Email', value: pujari.email },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={colors.gradientAarti} style={[styles.hero, { paddingTop: insets.top + spacing.huge }]}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + spacing.sm }]} hitSlop={8}>
            <Icon name="arrow-back" size={22} color={colors.maroon} />
          </Pressable>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{pujari.name.charAt(0)}</Text></View>
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
          <View style={styles.ethnicityBadge}><Text style={styles.ethnicityText}>{pujari.ethnicity} Tradition</Text></View>
        </LinearGradient>

        <Animated.View entering={FadeInDown.delay(150)} style={styles.statsRow}>
          {[
            { label: 'Experience', value: `${pujari.experience} yrs` },
            { label: 'Bookings', value: pujari.totalBookings.toLocaleString('en-IN') },
            { label: 'Rating', value: pujari.rating.toFixed(1) },
            { label: 'Rate/hr', value: formatINR(pujari.hourlyRate) },
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
                    <Text style={styles.pkgPrice}>{formatINR(pkg.price)}</Text>
                  </View>
                  <View style={styles.pkgDurationRow}>
                    <Icon name="time-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.pkgDuration}>{pkg.duration}</Text>
                  </View>
                  <Text style={styles.pkgDesc}>{pkg.description}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioSelected]}>{active && <View style={styles.radioInner} />}</View>
              </Pressable>
            );
          })}

          <Text style={styles.sectionTitle}>Reviews</Text>
          {REVIEWS.map((r, i) => (
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

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaLabel}>
            {selectedPkg ? formatINR(PACKAGES.find(p => p.id === selectedPkg)?.price || 0) : `From ${formatINR(pujari.hourlyRate)}/hr`}
          </Text>
          <Text style={styles.ctaSublabel}>{selectedPkg ? 'Package selected' : 'Select a package above'}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85 }]} onPress={() => router.push('/booking/cart')}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: -spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder, shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 3 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.headlineSmall, color: colors.primary, marginBottom: 2 },
  statLabel: { ...typography.labelSmall, color: colors.textMuted },
  body: { padding: spacing.lg },
  sectionTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginTop: spacing.xxl, marginBottom: spacing.md },
  bio: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 24 },
  detailsGrid: { gap: spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder },
  detailIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  detailText: { flex: 1 },
  detailLabel: { ...typography.labelSmall, color: colors.textMuted },
  detailValue: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
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
  reviewCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(242,112,10,0.10)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  reviewAvatarText: { ...typography.titleSmall, color: colors.primary },
  reviewMeta: { flex: 1 },
  reviewName: { ...typography.titleSmall, color: colors.textPrimary },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  reviewDate: { ...typography.labelSmall, color: colors.textMuted },
  reviewText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.md, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.cardBorderLight, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  ctaLabel: { ...typography.headlineSmall, color: colors.primary },
  ctaSublabel: { ...typography.bodySmall, color: colors.textMuted },
  bookBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  bookBtnText: { ...typography.button, color: '#fff', fontSize: 16 },
});
