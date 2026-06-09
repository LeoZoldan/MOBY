import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MbFinalizadaScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={30} color="#3B6D11" />
          </View>
          <Text style={styles.title}>Entrega concluída!</Text>
          <Text style={styles.sub}>Ótimo trabalho, Carlos!</Text>
        </View>

        <View style={styles.body}>

          <View style={styles.ganhoBox}>
            <View style={styles.ganhoIcon}>
              <Ionicons name="wallet-outline" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.ganhoLabel}>Você ganhou</Text>
              <Text style={styles.ganhoVal}>R$ 18,50</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalhes da corrida</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Corrida</Text>
              <Text style={styles.rowVal}>R$ 12,00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Máquina de cartão</Text>
              <Text style={styles.rowVal}>R$ 6,50</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tempo</Text>
              <Text style={styles.rowVal}>18 min</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Distância</Text>
              <Text style={styles.rowVal}>2,4 km</Text>
            </View>
          </View>

          <View style={styles.saldoCard}>
            <Text style={styles.saldoLabel}>Saldo disponível</Text>
            <Text style={styles.saldoVal}>R$ 338,50</Text>
            <Text style={styles.saldoSub}>Saque via PIX a qualquer momento</Text>
          </View>

        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.replace('/home-motoboy' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryTxt}>Voltar para o início</Text>
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
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  body: { flex: 1, padding: 16, gap: 12 },
  ganhoBox: {
    backgroundColor: '#EAF3DE',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#C0DD97',
  },
  ganhoIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#3B6D11',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ganhoLabel: { fontSize: 11, color: '#3B6D11', fontWeight: '500' },
  ganhoVal: { fontSize: 24, fontWeight: '800', color: '#3B6D11' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    gap: 10,
  },
  cardTitle: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 12, color: '#999' },
  rowVal: { fontSize: 12, fontWeight: '600', color: '#111' },
  saldoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    gap: 4,
  },
  saldoLabel: { fontSize: 11, color: '#999' },
  saldoVal: { fontSize: 22, fontWeight: '800', color: '#111' },
  saldoSub: { fontSize: 10, color: '#BBB' },
  footer: { padding: 16, paddingBottom: 32 },
  btnPrimary: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});