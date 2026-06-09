import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CorridaDisponivelScreen() {
  const aceitar = () => router.replace('/mb-a-caminho' as any);
  const recusar = () => router.back();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E8E4" />
      <View style={styles.container}>

        <View style={styles.map}>
          <Ionicons name="map-outline" size={32} color="#CCC" />
          <Text style={styles.mapTxt}>Mapa disponível no celular</Text>
          <View style={styles.pin as any}>
            <MaterialCommunityIcons name="moped" size={14} color="#fff" />
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeTxt}>Nova corrida</Text>
            </View>
            <Text style={styles.valor}>R$ 18,50</Text>
          </View>

          <View style={styles.pills}>
            <View style={styles.pill}><Text style={styles.pillTxt}>Entrega Express</Text></View>
            <View style={styles.pill}><Ionicons name="location-outline" size={11} color="#555" /><Text style={styles.pillTxt}>2,4 km</Text></View>
            <View style={styles.pill}><Ionicons name="time-outline" size={11} color="#555" /><Text style={styles.pillTxt}>~12 min</Text></View>
          </View>

          <View style={styles.rota}>
            <View style={styles.rotaItem}>
              <View style={[styles.rotaDot, { backgroundColor: '#111' }]} />
              <Text style={styles.rotaTxt}>Rua das Flores, 123 — Centro</Text>
            </View>
            <View style={styles.rotaLine} />
            <View style={styles.rotaItem}>
              <View style={[styles.rotaDot, { backgroundColor: '#3B6D11' }]} />
              <Text style={styles.rotaTxt}>Av. Brasil, 456 — Bairro Novo</Text>
            </View>
          </View>

          <View style={styles.btns}>
            <TouchableOpacity style={styles.btnRecusar} onPress={recusar} activeOpacity={0.8}>
              <Text style={styles.btnRecusarTxt}>Recusar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAceitar} onPress={aceitar} activeOpacity={0.85}>
              <Text style={styles.btnAceitarTxt}>Aceitar corrida</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  map: { flex: 1, backgroundColor: '#E8E8E4', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' },
  mapTxt: { fontSize: 13, color: '#AAA' },
  pin: {
    position: 'absolute', top: '35%', left: '42%',
    width: 32, height: 32, borderRadius: 99, backgroundColor: '#111',
    borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22,
    padding: 18, paddingBottom: 32, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: '#3B6D11' },
  badgeTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  valor: { fontSize: 22, fontWeight: '800', color: '#111' },
  pills: { flexDirection: 'row', gap: 6 },
  pill: { backgroundColor: '#F4F4F4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  pillTxt: { fontSize: 10, fontWeight: '600', color: '#555' },
  rota: { gap: 4 },
  rotaItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rotaDot: { width: 8, height: 8, borderRadius: 99, flexShrink: 0 },
  rotaTxt: { fontSize: 11, color: '#555', flex: 1 },
  rotaLine: { width: 1, height: 12, backgroundColor: '#E0E0E0', marginLeft: 3.5 },
  btns: { flexDirection: 'row', gap: 10 },
  btnRecusar: { flex: 1, borderRadius: 14, padding: 15, borderWidth: 1.5, borderColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center' },
  btnRecusarTxt: { fontSize: 14, fontWeight: '600', color: '#AAA' },
  btnAceitar: { flex: 2, borderRadius: 14, padding: 15, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnAceitarTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
});