import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function CorridaFinalizadaScreen() {
  const [estrelas, setEstrelas] = useState(4);

  const enviarAvaliacao = () => {
    router.replace('/home-cliente' as any);
  };

  const novoPedido = () => {
    router.replace('/home-cliente' as any);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={30} color="#3B6D11" />
          </View>
          <Text style={styles.title}>Entrega concluída!</Text>
          <Text style={styles.sub}>Seu pedido foi entregue com sucesso</Text>
        </View>

        <View style={styles.body}>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo da corrida</Text>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Entrega (2,4 km)</Text>
              <Text style={styles.resumoVal}>R$ 12,00</Text>
            </View>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Máquina de cartão</Text>
              <Text style={styles.resumoVal}>R$ 6,00</Text>
            </View>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Tempo</Text>
              <Text style={styles.resumoVal}>14 min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.resumoRow}>
              <Text style={styles.totalLabel}>Total pago</Text>
              <Text style={styles.totalVal}>R$ 18,00</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Avalie o motoboy</Text>
            <View style={styles.motoboyRow}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={20} color="#999" />
              </View>
              <View style={styles.mbInfo}>
                <Text style={styles.mbNome}>Carlos Motoboy</Text>
                <Text style={styles.mbSub}>ABC-1234 · Honda CG 160</Text>
              </View>
            </View>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.starBtn, s <= estrelas && styles.starBtnOn]}
                  onPress={() => setEstrelas(s)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="star" size={20} color={s <= estrelas ? '#F5A623' : '#DDD'} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.starLabel}>Toque nas estrelas para avaliar</Text>
          </View>

        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnPrimary} onPress={enviarAvaliacao} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryTxt}>Enviar avaliação</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={novoPedido} activeOpacity={0.8}>
            <Text style={styles.btnSecondaryTxt}>Fazer novo pedido</Text>
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 28,
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 99,
    backgroundColor: 'rgba(59,109,17,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(59,109,17,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
  body: { flex: 1, padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    gap: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumoLabel: { fontSize: 12, color: '#999' },
  resumoVal: { fontSize: 12, fontWeight: '600', color: '#111' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  totalVal: { fontSize: 18, fontWeight: '800', color: '#111' },
  motoboyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 99,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mbInfo: { flex: 1 },
  mbNome: { fontSize: 14, fontWeight: '700', color: '#111' },
  mbSub: { fontSize: 10, color: '#BBB', marginTop: 2 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 },
  starBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtnOn: { backgroundColor: '#FFF8E6', borderColor: '#F5A623' },
  starLabel: { fontSize: 10, color: '#BBB', textAlign: 'center', marginTop: 4 },
  footer: { padding: 16, paddingBottom: 32, gap: 8 },
  btnPrimary: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnSecondary: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
  },
  btnSecondaryTxt: { fontSize: 15, fontWeight: '600', color: '#AAA' },
});