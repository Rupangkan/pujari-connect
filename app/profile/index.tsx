/**
 * Profile Screen — account hub. Light Ivory & Gold theme.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useProfileStore } from '@/store/profileStore';

interface QuickAction { label: string; icon: IconName; href: Href; }
const QUICK_ACTIONS: QuickAction[] = [
  { label: 'My Bookings', icon: 'receipt-outline', href: '/booking/history' },
  { label: 'Wishlist', icon: 'heart-outline', href: '/wishlist' },
  { label: 'Addresses', icon: 'location-outline', href: '/booking/address' },
];

interface MenuItem { label: string; sublabel: string; icon: IconName; href?: Href; }
const MENU_ITEMS: MenuItem[] = [
  { icon: 'receipt-outline', label: 'My Bookings', sublabel: 'View all your bookings', href: '/booking/history' },
  { icon: 'heart-outline', label: 'Wishlist', sublabel: 'Saved pujas and rituals', href: '/wishlist' },
  { icon: 'location-outline', label: 'Saved Addresses', sublabel: 'Manage delivery addresses', href: '/booking/address' },
  { icon: 'card-outline', label: 'Payments', sublabel: 'Payment history & methods', href: '/profile/payments' },
  { icon: 'notifications-outline', label: 'Notifications', sublabel: 'Manage your alerts', href: '/profile/notifications' },
  { icon: 'help-buoy-outline', label: 'Help & Support', sublabel: 'Get assistance 24/7', href: '/profile/help' },
  { icon: 'document-text-outline', label: 'Terms & Privacy', sublabel: 'Legal information', href: '/profile/terms' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { name, phone, email } = useProfileStore();
  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <LinearGradient colors={colors.gradientScreen} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xxxl }}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Icon name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Profile</Text>
          <View style={styles.iconBtn} />
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <LinearGradient colors={colors.gradientAarti} style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          </LinearGradient>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userPhone}>{phone}</Text>
          {!!email && <Text style={styles.userEmail}>{email}</Text>}
          <Pressable
            onPress={() => router.push('/profile/edit')}
            style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.85 }]}
          >
            <Icon name="create-outline" size={15} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((q) => (
            <Pressable
              key={q.label}
              onPress={() => router.push(q.href)}
              style={({ pressed }) => [styles.quickCard, pressed && styles.cardPressed]}
            >
              <View style={styles.quickIcon}><Icon name={q.icon} size={20} color={colors.primary} /></View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, idx) => (
            <Pressable
              key={item.label}
              onPress={() => item.href && router.push(item.href)}
              style={({ pressed }) => [
                styles.menuItem,
                idx < MENU_ITEMS.length - 1 && styles.menuDivider,
                pressed && styles.menuItemPressed,
              ]}
            >
              <View style={styles.menuIcon}><Icon name={item.icon} size={20} color={colors.textSecondary} /></View>
              <View style={styles.menuLabel}>
                <Text style={styles.menuText}>{item.label}</Text>
                <Text style={styles.menuSublabel}>{item.sublabel}</Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* Log out */}
        <Pressable
          onPress={() => router.replace('/(auth)/onboarding')}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
        >
          <Icon name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Pujari Connect v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  topTitle: { ...typography.headlineSmall, color: colors.textPrimary },

  profileCard: {
    alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.sm, padding: spacing.xl,
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.cardBorder,
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 2,
  },
  avatarRing: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatar: { width: 82, height: 82, borderRadius: 41, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { ...typography.displayMedium, color: colors.primary },
  userName: { ...typography.headlineMedium, color: colors.textPrimary, marginBottom: 4 },
  userPhone: { ...typography.bodyMedium, color: colors.textSecondary },
  userEmail: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, borderWidth: 1.5, borderColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  editBtnText: { ...typography.labelMedium, color: colors.primary, fontWeight: '600' },

  quickRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.md },
  quickCard: { flex: 1, alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingVertical: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder },
  cardPressed: { backgroundColor: colors.cardBgHover },
  quickIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  quickLabel: { ...typography.labelMedium, color: colors.textSecondary, fontWeight: '600' },

  menuSection: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardBorder },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  menuItemPressed: { backgroundColor: colors.cardBgHover },
  menuIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  menuLabel: { flex: 1 },
  menuText: { ...typography.titleSmall, color: colors.textPrimary },
  menuSublabel: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: 'rgba(220,38,38,0.06)', padding: spacing.lg, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: 'rgba(220,38,38,0.22)' },
  logoutText: { ...typography.button, color: colors.error },
  version: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
