/**
 * Address Selection — checkout step 1: select or add delivery address (live data).
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { userService } from '@/services/user.service';
import { useBookingDraft } from '@/store/bookingDraft';
import { Address } from '@/types';

interface AddressFormData { fullName: string; phone: string; pinCode: string; state: string; city: string; flatHouse: string; area: string; landmark: string; }
const EMPTY_FORM: AddressFormData = { fullName: '', phone: '', pinCode: '', state: '', city: '', flatHouse: '', area: '', landmark: '' };

export default function AddressScreen() {
  const insets = useSafeAreaInsets();
  const setAddress = useBookingDraft(s => s.setAddress);

  const { data, loading, error, reload } = useApi<Address[]>(
    () => userService.getAddresses().then(r => (r.data as any).data as Address[]),
    []
  );
  const addresses = data ?? [];

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Default selection once addresses load.
  useEffect(() => {
    if (!selectedAddress && addresses.length) {
      setSelectedAddress((addresses.find(a => a.isDefault) ?? addresses[0]).id);
    }
  }, [addresses, selectedAddress]);

  const updateForm = (key: keyof AddressFormData, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const isFormValid = form.fullName && form.phone.length === 10 && form.pinCode.length === 6
    && form.state && form.city && form.flatHouse && form.area;

  const handleSaveAddress = async () => {
    if (!isFormValid || saving) return;
    setSaveError('');
    setSaving(true);
    try {
      const res = await userService.addAddress({ ...form, isDefault: addresses.length === 0 } as any);
      const created = (res.data as any).data as Address;
      setShowAddForm(false);
      setForm(EMPTY_FORM);
      setSelectedAddress(created.id);
      reload();
    } catch (e: any) {
      setSaveError(e?.response?.data?.message || 'Could not save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    const addr = addresses.find(a => a.id === selectedAddress);
    if (!addr) return;
    setAddress(addr.id, `${addr.flatHouse}, ${addr.area}, ${addr.city} - ${addr.pinCode}`);
    router.push('/booking/payment');
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Icon name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Select Address</Text>
        </View>

        {loading ? (
          <LoadingView />
        ) : error ? (
          <ErrorView message={error} onRetry={reload} />
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
              {!showAddForm && (
                <>
                  {addresses.length === 0 ? (
                    <EmptyView icon="location-outline" title="No saved addresses" subtitle="Add a delivery address to continue." style={{ minHeight: 180 }} />
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>Saved Addresses</Text>
                      {addresses.map(addr => {
                        const active = selectedAddress === addr.id;
                        return (
                          <Pressable key={addr.id} onPress={() => setSelectedAddress(addr.id)} style={[styles.addressCard, active && styles.addressCardSelected]}>
                            <View style={[styles.radio, active && styles.radioSelected]}>{active && <View style={styles.radioInner} />}</View>
                            <View style={styles.addressInfo}>
                              <View style={styles.addressNameRow}>
                                <Text style={styles.addressName}>{addr.fullName}</Text>
                                {addr.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Default</Text></View>}
                              </View>
                              <Text style={styles.addressText}>{addr.flatHouse}, {addr.area}</Text>
                              <Text style={styles.addressText}>{addr.city}, {addr.state} - {addr.pinCode}</Text>
                              {!!addr.landmark && (
                                <View style={styles.metaRow}><Icon name="location-outline" size={12} color={colors.textMuted} /><Text style={styles.addressMeta}>{addr.landmark}</Text></View>
                              )}
                              <View style={styles.metaRow}><Icon name="call-outline" size={12} color={colors.textMuted} /><Text style={styles.addressMeta}>{addr.phone}</Text></View>
                            </View>
                          </Pressable>
                        );
                      })}
                    </>
                  )}

                  <Pressable onPress={() => setShowAddForm(true)} style={styles.addAddressBtn}>
                    <Icon name="add" size={20} color={colors.primary} />
                    <Text style={styles.addAddressText}>Add New Address</Text>
                  </Pressable>
                </>
              )}

              {showAddForm && (
                <Animated.View entering={FadeInDown.duration(250)}>
                  <View style={styles.formHeader}>
                    <Text style={styles.sectionTitle}>Add New Address</Text>
                    <Pressable onPress={() => setShowAddForm(false)} hitSlop={8}><Text style={styles.cancelText}>Cancel</Text></Pressable>
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

                  {!!saveError && <Text style={styles.saveError}>{saveError}</Text>}
                  <Pressable
                    onPress={handleSaveAddress}
                    disabled={!isFormValid || saving}
                    style={({ pressed }) => [styles.saveBtn, isFormValid && styles.saveBtnActive, pressed && { opacity: 0.85 }]}
                  >
                    <Text style={[styles.saveBtnText, isFormValid && styles.saveBtnTextActive]}>{saving ? 'Saving...' : 'Save Address'}</Text>
                  </Pressable>
                </Animated.View>
              )}

              <View style={{ height: 140 }} />
            </ScrollView>

            {!showAddForm && addresses.length > 0 && (
              <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
                <Pressable onPress={handleContinue} disabled={!selectedAddress} style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.85 }]}>
                  <Text style={styles.continueBtnText}>Continue to Payment</Text>
                  <Icon name="arrow-forward" size={16} color={colors.textOnPrimary} />
                </Pressable>
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.sm },
  addressCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.cardBorder },
  addressCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(242,112,10,0.05)' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, marginRight: spacing.md, marginTop: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  addressInfo: { flex: 1 },
  addressNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  addressName: { ...typography.titleSmall, color: colors.textPrimary },
  defaultBadge: { backgroundColor: 'rgba(22,163,74,0.10)', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.xs, borderWidth: 1, borderColor: 'rgba(22,163,74,0.25)' },
  defaultBadgeText: { ...typography.badge, color: colors.success, fontSize: 9 },
  addressText: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  addressMeta: { ...typography.bodySmall, color: colors.textMuted },
  addAddressBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  addAddressText: { ...typography.titleSmall, color: colors.primary },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  cancelText: { ...typography.labelMedium, color: colors.error, fontWeight: '600' },
  fieldContainer: { marginBottom: spacing.md },
  fieldLabel: { ...typography.labelMedium, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600' },
  fieldInput: { backgroundColor: colors.surface, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: spacing.md, paddingVertical: spacing.md, ...typography.bodyMedium, color: colors.textPrimary },
  saveError: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.sm },
  saveBtn: { backgroundColor: colors.surfaceContainerHigh, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  saveBtnActive: { backgroundColor: colors.primary },
  saveBtnText: { ...typography.button, color: colors.textMuted },
  saveBtnTextActive: { color: colors.textOnPrimary },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, paddingTop: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cardBorderLight, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.success, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  continueBtnText: { ...typography.button, color: colors.textOnPrimary, fontSize: 16 },
});
