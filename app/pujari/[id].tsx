/**
 * Pujari Detail Screen — Full pujari profile with booking options
 * Ported from MyPandit's PujariDetailActivity.kt
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
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
        <Text key={i} style={i <= Math.round(rating) ? starStyles.filled : starStyles.empty}>★</Text>
      ))}
      <Text style={starStyles.label}> {rating.toFixed(1)}</Text>
    </View>
  );
}
const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  filled: { fontSize: 16, color: colors.starFilled },
  empty: { fontSize: 16, color: colors.starEmpty },
  label: { ...typography.labelMedium, color: colors.textSecondary, marginLeft: 4 },
});

export default function PujariDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pujari = PUJARI_DATA[id || ''] || DEFAULT_PUJARI;
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#2D1408', '#1A0A00', colors.background]} style={styles.hero}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{pujari.name.charAt(0)}</Text>
            </View>
            {pujari.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{pujari.name}</Text>
          <Text style={styles.specialization}>{pujari.specialization}</Text>
          <StarRating rating={pujari.rating} />

          {/* Ethnicity badge */}
          <View style={styles.ethnicityBadge}>
            <Text style={styles.ethnicityText}>{pujari.ethnicity} Tradition</Text>
          </View>
        </LinearGradient>

        {/* Stats row */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsRow}>
          {[
            { label: 'Experience', value: `${pujari.experience} yrs` },
            { label: 'Bookings', value: pujari.totalBookings.toLocaleString() },
            { label: 'Rating', value: pujari.rating.toFixed(1) },
            { label: 'Rate/hr', value: `₹${pujari.hourlyRate.toLocaleString()}` },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.body}>
          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{pujari.bio}</Text>

          {/* Details grid */}
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            {[
              { icon: '📍', label: 'Location', value: pujari.location },
              { icon: '🗣️', label: 'Languages', value: pujari.languages },
              { icon: '📞', label: 'Contact', value: pujari.phone },
              { icon: '✉️', label: 'Email', value: pujari.email },
            ].map((d, i) => (
              <View key={i} style={styles.detailItem}>
                <Text style={styles.detailIcon}>{d.icon}</Text>
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{d.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Packages */}
          <Text style={styles.sectionTitle}>Select Package</Text>
          {PACKAGES.map(pkg => (
            <Pressable
              key={pkg.id}
              onPress={() => setSelectedPkg(pkg.id)}
              style={[styles.pkgCard, selectedPkg === pkg.id && styles.pkgCardSelected]}
            >
              {pkg.popular && (
                <View style={styles.popularBadge}><Text style={styles.popularText}>⭐ Most Popular</Text></View>
              )}
              <View style={styles.pkgHeader}>
                <View>
                  <Text style={styles.pkgName}>{pkg.name}</Text>
                  <Text style={styles.pkgDuration}>⏱ {pkg.duration}</Text>
                </View>
                <Text style={styles.pkgPrice}>₹{pkg.price.toLocaleString()}</Text>
              </View>
              <Text style={styles.pkgDesc}>{pkg.description}</Text>
              <View style={[styles.radio, selectedPkg === pkg.id && styles.radioSelected]}>
                {selectedPkg === pkg.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}

          {/* Reviews section */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          {[
            { name: 'Priya S.', rating: 5, text: 'Excellent service! Very knowledgeable and performed the puja with great devotion.', date: '2 days ago' },
            { name: 'Rahul M.', rating: 5, text: 'Professional and punctual. The rituals were performed exactly as per tradition.', date: '1 week ago' },
            { name: 'Anita B.', rating: 4, text: 'Very good experience. Explained every ritual in detail. Highly recommended!', date: '2 weeks ago' },
          ].map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name.charAt(0)}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <View style={styles.reviewRating}>
                    {Array.from({ length: r.rating }).map((_, si) => (
                      <Text key={si} style={styles.reviewStar}>★</Text>
                    ))}
                    <Text style={styles.reviewDate}> · {r.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <LinearGradient
        colors={['transparent', colors.background, colors.background]}
        style={styles.bottomBar}
        pointerEvents="box-none"
      >
        <View style={styles.ctaRow}>
          <View>
            <Text style={styles.ctaLabel}>
              {selectedPkg
                ? `₹${(PACKAGES.find(p => p.id === selectedPkg)?.price || 0).toLocaleString()}`
                : `From ₹${pujari.hourlyRate.toLocaleString()}/hr`}
            </Text>
            <Text style={styles.ctaSublabel}>{selectedPkg ? 'Package selected' : 'Select a package above'}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.push(`/puja/1`)}
          >
            <Text style={styles.bookBtnText}>Book Now 🙏</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // Hero
  hero: { paddingBottom: spacing.xl, alignItems: 'center', paddingTop: spacing.huge },
  backBtn: { position: 'absolute', top: spacing.xl + 24, left: spacing.lg, padding: spacing.sm },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  avatarContainer: { alignItems: 'center', marginBottom: spacing.md },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,121,44,0.2)', borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.displayLarge, color: colors.primary, fontSize: 36 },
  verifiedBadge: { marginTop: spacing.sm, backgroundColor: 'rgba(6,193,103,0.15)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(6,193,103,0.3)' },
  verifiedText: { ...typography.badge, color: colors.success },
  name: { ...typography.headlineLarge, color: colors.textPrimary, marginBottom: 4, textAlign: 'center' },
  specialization: { ...typography.bodyMedium, color: colors.textSecondary, marginBottom: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xxl },
  ethnicityBadge: { marginTop: spacing.sm, backgroundColor: 'rgba(255,237,41,0.1)', paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(255,237,41,0.25)' },
  ethnicityText: { ...typography.labelMedium, color: colors.accentYellow },
  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.cardBg, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.headlineSmall, color: colors.primary, marginBottom: 2 },
  statLabel: { ...typography.labelSmall, color: colors.textMuted },
  // Body
  body: { padding: spacing.lg },
  sectionTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  bio: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 24 },
  // Details
  detailsGrid: { gap: spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder },
  detailIcon: { fontSize: 20, marginRight: spacing.md },
  detailText: { flex: 1 },
  detailLabel: { ...typography.labelSmall, color: colors.textMuted },
  detailValue: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  // Packages
  pkgCard: { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.cardBorder, position: 'relative' },
  pkgCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255,121,44,0.06)' },
  popularBadge: { backgroundColor: 'rgba(255,237,41,0.15)', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm, marginBottom: spacing.sm, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,237,41,0.25)' },
  popularText: { ...typography.badge, color: colors.accentYellow, fontSize: 10 },
  pkgHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  pkgName: { ...typography.titleMedium, color: colors.textPrimary },
  pkgDuration: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  pkgPrice: { ...typography.price, color: colors.accentYellow },
  pkgDesc: { ...typography.bodySmall, color: colors.textMuted },
  radio: { position: 'absolute', top: spacing.lg, right: spacing.lg, width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  // Reviews
  reviewCard: { backgroundColor: colors.cardBg, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,121,44,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  reviewAvatarText: { ...typography.titleSmall, color: colors.primary },
  reviewMeta: { flex: 1 },
  reviewName: { ...typography.titleSmall, color: colors.textPrimary },
  reviewRating: { flexDirection: 'row', alignItems: 'center' },
  reviewStar: { fontSize: 12, color: colors.starFilled },
  reviewDate: { ...typography.labelSmall, color: colors.textMuted },
  reviewText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 18 },
  // Bottom CTA
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl, paddingHorizontal: spacing.lg },
  ctaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaLabel: { ...typography.headlineSmall, color: colors.accentYellow },
  ctaSublabel: { ...typography.bodySmall, color: colors.textMuted },
  bookBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.xxl, paddingVertical: spacing.lg, borderRadius: borderRadius.xl },
  bookBtnText: { ...typography.button, color: '#fff', fontSize: 16 },
});
