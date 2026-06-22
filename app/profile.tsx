/**
 * Profile Screen
 * Ported from MyPandit's ProfileScreen.kt
 */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';

const MENU_ITEMS = [
  { icon: '📋', label: 'My Bookings', sublabel: 'View all your bookings', onPress: () => {} },
  { icon: '❤️', label: 'Wishlist', sublabel: 'Saved pujas and rituals', onPress: () => {} },
  { icon: '📍', label: 'Saved Addresses', sublabel: 'Manage delivery addresses', onPress: () => {} },
  { icon: '💳', label: 'Payments', sublabel: 'Payment history & methods', onPress: () => {} },
  { icon: '🔔', label: 'Notifications', sublabel: 'Manage your alerts', onPress: () => {} },
  { icon: '⭐', label: 'Rate the App', sublabel: 'Share your feedback', onPress: () => {} },
  { icon: '📞', label: 'Help & Support', sublabel: 'Get assistance 24/7', onPress: () => {} },
  { icon: '📄', label: 'Terms & Privacy', sublabel: 'Legal information', onPress: () => {} },
];

export default function ProfileScreen() {
  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←  Profile</Text>
        </Pressable>

        {/* Avatar and user info */}
        <View style={styles.profileSection}>
          <LinearGradient colors={['rgba(255,121,44,0.2)', 'rgba(255,121,44,0.05)']} style={styles.avatarBg}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>B</Text>
            </View>
          </LinearGradient>
          <Text style={styles.userName}>Bishal Das</Text>
          <Text style={styles.userPhone}>+91 99999 99999</Text>
          <Text style={styles.userEmail}>bishaldas@mypujari.com</Text>
          <Pressable style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Bookings', value: '0' },
            { label: 'Wishlist', value: '0' },
            { label: 'Addresses', value: '1' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, idx) => (
            <Pressable
              key={idx}
              onPress={item.onPress}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuLabel}>
                <Text style={styles.menuText}>{item.label}</Text>
                <Text style={styles.menuSublabel}>{item.sublabel}</Text>
              </View>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          onPress={() => router.replace('/(auth)/onboarding')}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Pujari Connect v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  backIcon: { ...typography.titleMedium, color: colors.primary },
  profileSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarBg: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,121,44,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary },
  avatarInitial: { ...typography.displayMedium, color: colors.primary },
  userName: { ...typography.headlineMedium, color: colors.textPrimary, marginBottom: 4 },
  userPhone: { ...typography.bodyMedium, color: colors.textSecondary },
  userEmail: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.lg },
  editBtn: { borderWidth: 1.5, borderColor: colors.primary, paddingHorizontal: spacing.xxl, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  editBtnText: { ...typography.labelMedium, color: colors.primary },
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginBottom: spacing.xl, gap: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  statValue: { ...typography.headlineLarge, color: colors.primary },
  statLabel: { ...typography.labelSmall, color: colors.textMuted, marginTop: 4 },
  menuSection: { marginHorizontal: spacing.lg, backgroundColor: colors.cardBg, borderRadius: borderRadius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardBorder },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  menuItemPressed: { backgroundColor: colors.cardBgHover },
  menuIcon: { fontSize: 22, marginRight: spacing.lg },
  menuLabel: { flex: 1 },
  menuText: { ...typography.titleSmall, color: colors.textPrimary },
  menuSublabel: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  menuChevron: { fontSize: 20, color: colors.textMuted },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: 'rgba(255,84,73,0.1)', padding: spacing.lg, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(255,84,73,0.2)' },
  logoutIcon: { fontSize: 20, marginRight: spacing.md },
  logoutText: { ...typography.button, color: colors.error },
  version: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
