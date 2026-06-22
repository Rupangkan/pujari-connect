/**
 * Address Selection Screen — Checkout step 1: Select or add delivery address
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';

const SAVED_ADDRESSES = [
  {
    id: '1',
    fullName: 'Bishal Das',
    phone: '9999999999',
    flatHouse: '42, Divine Residency',
    area: 'Koramangala, 4th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    landmark: 'Near Forum Mall',
    isDefault: true,
  },
];

interface AddressFormData {
  fullName: string;
  phone: string;
  pinCode: string;
  state: string;
  city: string;
  flatHouse: string;
  area: string;
  landmark: string;
}

const EMPTY_FORM: AddressFormData = {
  fullName: '', phone: '', pinCode: '', state: '',
  city: '', flatHouse: '', area: '', landmark: '',
};

export default function AddressScreen() {
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);

  const updateForm = (key: keyof AddressFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const isFormValid = form.fullName && form.phone.length === 10 && form.pinCode.length === 6
    && form.state && form.city && form.flatHouse && form.area;

  const selectedAddr = SAVED_ADDRESSES.find(a => a.id === selectedAddress);

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>Select Address</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Saved addresses */}
        {!showAddForm && (
          <>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            {SAVED_ADDRESSES.map(addr => (
              <Pressable
                key={addr.id}
                onPress={() => setSelectedAddress(addr.id)}
                style={[styles.addressCard, selectedAddress === addr.id && styles.addressCardSelected]}
              >
                <View style={[styles.radio, selectedAddress === addr.id && styles.radioSelected]}>
                  {selectedAddress === addr.id && <View style={styles.radioInner} />}
                </View>
                <View style={styles.addressInfo}>
                  <View style={styles.addressNameRow}>
                    <Text style={styles.addressName}>{addr.fullName}</Text>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Default</Text></View>
                    )}
                  </View>
                  <Text style={styles.addressText}>
                    {addr.flatHouse}, {addr.area}
                  </Text>
                  <Text style={styles.addressText}>
                    {addr.city}, {addr.state} - {addr.pinCode}
                  </Text>
                  {addr.landmark && (
                    <Text style={styles.addressLandmark}>📍 {addr.landmark}</Text>
                  )}
                  <Text style={styles.addressPhone}>📞 {addr.phone}</Text>
                </View>
              </Pressable>
            ))}

            {/* Add new address button */}
            <Pressable
              onPress={() => setShowAddForm(true)}
              style={styles.addAddressBtn}
            >
              <Text style={styles.addAddressIcon}>＋</Text>
              <Text style={styles.addAddressText}>Add New Address</Text>
            </Pressable>
          </>
        )}

        {/* Add address form */}
        {showAddForm && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={styles.formHeader}>
              <Text style={styles.sectionTitle}>Add New Address</Text>
              <Pressable onPress={() => setShowAddForm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>

            {[
              { key: 'fullName', label: 'Full Name', placeholder: 'Enter your full name', keyboardType: 'default' as const },
              { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', keyboardType: 'phone-pad' as const },
              { key: 'flatHouse', label: 'Flat / House / Building', placeholder: 'House no., Building name', keyboardType: 'default' as const },
              { key: 'area', label: 'Area / Street / Locality', placeholder: 'Colony, Locality, Street', keyboardType: 'default' as const },
              { key: 'landmark', label: 'Landmark (Optional)', placeholder: 'Near hospital, school, etc.', keyboardType: 'default' as const },
              { key: 'city', label: 'City', placeholder: 'Your city', keyboardType: 'default' as const },
              { key: 'state', label: 'State', placeholder: 'Your state', keyboardType: 'default' as const },
              { key: 'pinCode', label: 'PIN Code', placeholder: '6-digit PIN code', keyboardType: 'number-pad' as const },
            ].map(field => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textMuted}
                  value={form[field.key as keyof AddressFormData]}
                  onChangeText={v => updateForm(field.key as keyof AddressFormData, v)}
                  keyboardType={field.keyboardType}
                  maxLength={field.key === 'phone' ? 10 : field.key === 'pinCode' ? 6 : 100}
                />
              </View>
            ))}

            <Pressable
              onPress={() => {
                if (isFormValid) setShowAddForm(false);
              }}
              style={({ pressed }) => [styles.saveBtn, isFormValid && styles.saveBtnActive, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.saveBtnText, isFormValid && styles.saveBtnTextActive]}>
                Save Address
              </Text>
            </Pressable>
          </Animated.View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom CTA */}
      {!showAddForm && (
        <View style={styles.bottomBar}>
          {selectedAddr && (
            <Text style={styles.selectedAddr} numberOfLines={1}>
              📍 {selectedAddr.flatHouse}, {selectedAddr.city}
            </Text>
          )}
          <Pressable
            onPress={() => router.push('/booking/payment')}
            style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.continueBtnText}>Continue to Payment →</Text>
          </Pressable>
        </View>
      )}
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
  sectionTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },
  // Address card
  addressCard: { flexDirection: 'row', backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.cardBorder },
  addressCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255,121,44,0.06)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textMuted, marginRight: spacing.md, marginTop: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  addressInfo: { flex: 1 },
  addressNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  addressName: { ...typography.titleSmall, color: colors.textPrimary, marginRight: spacing.sm },
  defaultBadge: { backgroundColor: 'rgba(6,193,103,0.15)', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.xs, borderWidth: 1, borderColor: 'rgba(6,193,103,0.3)' },
  defaultBadgeText: { ...typography.badge, color: colors.success, fontSize: 9 },
  addressText: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 2 },
  addressLandmark: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  addressPhone: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4 },
  // Add address
  addAddressBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed' as const, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  addAddressIcon: { fontSize: 20, color: colors.primary, marginRight: spacing.sm },
  addAddressText: { ...typography.titleSmall, color: colors.primary },
  // Form
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  cancelText: { ...typography.labelMedium, color: colors.error },
  fieldContainer: { marginBottom: spacing.md },
  fieldLabel: { ...typography.labelMedium, color: colors.textSecondary, marginBottom: spacing.xs },
  fieldInput: { backgroundColor: colors.cardBg, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: spacing.md, paddingVertical: spacing.md, ...typography.bodyMedium, color: colors.textPrimary },
  saveBtn: { backgroundColor: colors.surfaceContainerHigh, paddingVertical: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  saveBtnActive: { backgroundColor: colors.primary },
  saveBtnText: { ...typography.button, color: colors.textMuted },
  saveBtnTextActive: { color: '#fff' },
  // Bottom CTA
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surfaceContainerHighest, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  selectedAddr: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.sm },
  continueBtn: { backgroundColor: colors.success, paddingVertical: spacing.lg, borderRadius: borderRadius.xl, alignItems: 'center' },
  continueBtnText: { ...typography.button, color: '#fff', fontSize: 16 },
});
