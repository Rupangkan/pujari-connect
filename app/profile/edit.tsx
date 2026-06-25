/**
 * Edit Profile Screen — edit name / email / DOB / gender. Light theme.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { useProfileStore } from '@/store/profileStore';

const GENDERS = ['Male', 'Female', 'Other'];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const profile = useProfileStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth);
  const [gender, setGender] = useState(profile.gender);

  const nameValid = name.trim().length >= 2;

  const handleSave = () => {
    if (!nameValid) return;
    profile.updateProfile({ name: name.trim(), email: email.trim(), dateOfBirth: dateOfBirth.trim(), gender });
    router.back();
  };

  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <LinearGradient colors={colors.gradientScreen} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        {/* Header */}
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Icon name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Edit Profile</Text>
          <View style={styles.iconBtn} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.xxxl }}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient colors={colors.gradientAarti} style={styles.avatarRing}>
              <View style={styles.avatar}><Text style={styles.avatarInitial}>{initial}</Text></View>
            </LinearGradient>
          </View>

          {/* Full name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
          />
          {!nameValid && <Text style={styles.error}>Name must be at least 2 characters.</Text>}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Phone (read-only) */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.input, styles.inputDisabled]}>
            <Text style={styles.disabledText}>{profile.phone}</Text>
            <Icon name="lock-closed" size={14} color={colors.textMuted} />
          </View>
          <Text style={styles.helper}>Phone is linked to your account and can't be changed here.</Text>

          {/* DOB */}
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
          />

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.segment}>
            {GENDERS.map((g) => {
              const active = gender === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.segmentItem, active && styles.segmentItemActive]}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{g}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Save bar */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={!nameValid}
            style={({ pressed }) => [styles.saveBtn, !nameValid && styles.saveBtnDisabled, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  topTitle: { ...typography.headlineSmall, color: colors.textPrimary },

  avatarSection: { alignItems: 'center', marginVertical: spacing.lg },
  avatarRing: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { ...typography.displayMedium, color: colors.primary },

  label: { ...typography.labelMedium, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.lg, fontWeight: '600' },
  input: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    ...typography.bodyLarge, color: colors.textPrimary,
  },
  inputDisabled: { backgroundColor: colors.surfaceContainerHigh },
  disabledText: { ...typography.bodyLarge, color: colors.textMuted },
  helper: { ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.xs },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.xs },

  segment: { flexDirection: 'row', backgroundColor: colors.surfaceContainerHigh, borderRadius: borderRadius.lg, padding: 4, gap: 4 },
  segmentItem: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' },
  segmentItemActive: { backgroundColor: colors.primary },
  segmentText: { ...typography.labelLarge, color: colors.textSecondary, fontWeight: '600' },
  segmentTextActive: { color: colors.textOnPrimary },

  bottomBar: {
    flexDirection: 'row', gap: spacing.md, paddingTop: spacing.md, paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.cardBorderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  cancelBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.cardBorderLight },
  cancelText: { ...typography.button, color: colors.textSecondary },
  saveBtn: { flex: 2, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, borderRadius: borderRadius.full, backgroundColor: colors.primary },
  saveBtnDisabled: { backgroundColor: colors.surfaceContainerHighest },
  saveText: { ...typography.button, color: colors.textOnPrimary },
});
