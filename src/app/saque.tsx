import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

const CHIPS = ['50', '100', '200', 'Tudo'];
const SALDO = 320;

export default function SaqueScreen() {
  const [valor, setValor] = useState('');

  const aplicarChip = (chip: string) => {
    if (chip === 'Tudo') setValor(SALDO.toFixed(2).replace('.', ','));
    else setValor(parseFloat(chip).toFixed(2).replace('.', ','));
  };

  const valorNumerico = parseFloat(valor.replace(',', '.')) || 0;

  const sacar = () => {
    // TODO: chamar API de saque
    router.back();
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>

          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.backTxt}>Voltar</Text>
              </TouchableOpacity>
              <View style={styles.saldoBox}>
                <Text style={styles.saldoLabel}>Saldo disponível</Text>
                <Text style={styles.saldoVal}>R$ {SALDO.toFixed(2).replace('.', ',')}</Text>
                <Text style={styles.saldoSub}>Atualizado agora</Text>
              </View>
            </View>
          </SafeAreaView>

          <View style={styles.body}>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Valor do saque</Text>
              <View style={styles.valorBox}>
                <Text style={styles.valorPrefix}>R$</Text>
                <TextInput
                  style={styles.valorInput}
                  value={valor}
                  onChangeText={setValor}
                  placeholder="0,00"
                  placeholderTextColor="#CCC"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.chips}>
                {CHIPS.map((chip) => (
                  <TouchableOpacity
                    key={chip}
                    style={[styles.chip, valor === (chip === 'Tudo' ? SALDO.toFixed(2).replace('.', ',') : parseFloat(chip).toFixed(2).replace('.', ',')) && styles.chipActive]}
                    onPress={() => aplicarChip(chip)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipTxt, valor === (chip === 'Tudo' ? SALDO.toFixed(2).replace('.', ',') : parseFloat(chip).toFixed(2).replace('.', ',')) && styles.chipTxtActive]}>
                      {chip === 'Tudo' ? 'Tudo' : `R$ ${chip}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Chave PIX</Text>
              <View style={styles.pixRow}>
                <View style={styles.pixIcon}>
                  <Ionicons name="wallet-outline" size={18} color="#3B6D11" />
                </View>
                <View style={styles.pixInfo}>
                  <Text style={styles.pixLabel}>CPF cadastrado</Text>
                  <Text style={styles.pixVal}>000.000.000-00</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#3B6D11" />
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color="#C89000" style={{ marginTop: 1 }} />
              <Text style={styles.infoTxt}>
                O valor será transferido em até <Text style={styles.infoBold}>30 minutos</Text> para sua chave PIX. Saques disponíveis de segunda a sábado.
              </Text>
            </View>

          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btnSacar, valorNumerico <= 0 && styles.btnSacarDisabled]}
              onPress={sacar}
              activeOpacity={0.85}
              disabled={valorNumerico <= 0}
            >
              <Ionicons name="arrow-forward-outline" size={18} color="#fff" />
              <Text style={styles.btnSacarTxt}>
                {valorNumerico > 0 ? `Sacar R$ ${valor}` : 'Sacar'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    backgroundColor: '#0D0D0D', paddingHorizontal: 20,
    paddingTop: 10, paddingBottom: 28, gap: 16,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  saldoBox: { alignItems: 'center', gap: 4 },
  saldoLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  saldoVal: { fontSize: 36, fontWeight: '800', color: '#fff' },
  saldoSub: { fontSize: 10, color: 'rgba(255,255,255,0.2)' },
  body: { flex: 1, padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EBEBEB', gap: 12 },
  cardTitle: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' },
  valorBox: {
    backgroundColor: '#F7F7F7', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#EBEBEB',
  },
  valorPrefix: { fontSize: 20, fontWeight: '700', color: '#BBB' },
  valorInput: { flex: 1, fontSize: 26, fontWeight: '800', color: '#111', padding: 0 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, backgroundColor: '#F4F4F4', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipTxt: { fontSize: 12, fontWeight: '600', color: '#555' },
  chipTxtActive: { color: '#fff' },
  pixRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pixIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center' },
  pixInfo: { flex: 1 },
  pixLabel: { fontSize: 10, color: '#AAA' },
  pixVal: { fontSize: 13, fontWeight: '600', color: '#111', marginTop: 1 },
  infoBox: {
    backgroundColor: '#FFF8E6', borderRadius: 12, padding: 14,
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    borderWidth: 1, borderColor: '#FFE4A0',
  },
  infoTxt: { flex: 1, fontSize: 11, color: '#7A5C00', lineHeight: 17 },
  infoBold: { fontWeight: '700' },
  footer: { padding: 16, paddingBottom: 32 },
  btnSacar: {
    backgroundColor: '#3B6D11', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnSacarDisabled: { backgroundColor: '#CCC' },
  btnSacarTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});