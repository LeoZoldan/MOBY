import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { listarDisponiveis, aceitarPedido, getMe } from '../services/api';

const { height } = Dimensions.get('window');

export default function HomeMotoboyScreen() {
  const [online, setOnline] = useState(true);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    getMe().then(setUsuario);
  }, []);

  useEffect(() => {
    if (online) {
      buscarPedidos();
      const interval = setInterval(buscarPedidos, 5000);
      return () => clearInterval(interval);
    }
  }, [online]);

  const buscarPedidos = async () => {
    try {
      const data = await listarDisponiveis();
      if (Array.isArray(data)) setPedidos(data);
    } catch (err) {
      console.log('Erro ao buscar pedidos:', err);
    }
  };

  const handleAceitar = async (pedidoId: string) => {
    setLoading(true);
    try {
      const data = await aceitarPedido(pedidoId);
      if (data.erro) {
        alert(data.erro);
        return;
      }
      router.push('/mb-a-caminho' as any);
    } catch (err) {
      alert('Erro ao aceitar pedido');
    } finally {
      setLoading(false);
    }
  };

  const pedidoAtual = pedidos[0];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.container}>

        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/perfil-motoboy' as any)} activeOpacity={0.8}>
              <Ionicons name="person-circle-outline" size={36} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.greeting}>Bem-vindo de volta</Text>
              <Text style={styles.name}>{usuario?.nome || 'Motoboy'}</Text>
            </View>
            <TouchableOpacity style={styles.toggleWrap} onPress={() => setOnline(!online)} activeOpacity={0.8}>
              <Text style={[styles.toggleLabel, { color: online ? '#3B6D11' : '#AAA' }]}>
                {online ? 'Online' : 'Offline'}
              </Text>
              <View style={[styles.toggle, { backgroundColor: online ? '#3B6D11' : '#CCC' }]}>
                <View style={[styles.toggleDot, online && styles.toggleDotOn]} />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.mapContainer}>
          <View style={[styles.map, { backgroundColor: '#E8E8E4', alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="map-outline" size={32} color="#CCC" />
            <Text style={{ color: '#CCC', fontSize: 12, marginTop: 6 }}>Mapa disponível no celular</Text>
          </View>
          <View style={styles.earningsStrip}>
            <View style={styles.earnItem}>
              <Text style={styles.earnLabel}>Disponíveis</Text>
              <Text style={[styles.earnValue, { color: '#3B6D11' }]}>{pedidos.length}</Text>
            </View>
            <View style={styles.earnDivider} />
            <View style={styles.earnItem}>
              <Text style={styles.earnLabel}>Status</Text>
              <Text style={styles.earnValue}>{online ? 'Online' : 'Offline'}</Text>
            </View>
            <View style={styles.earnDivider} />
            <View style={styles.earnItem}>
              <Text style={styles.earnLabel}>Área</Text>
              <Text style={styles.earnValue}>Local</Text>
            </View>
          </View>
        </View>

        {online && pedidoAtual && (
          <View style={styles.corridaCard}>
            <View style={styles.corridaHeader}>
              <View style={styles.corridaBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeTxt}>Nova corrida disponível</Text>
              </View>
              <Text style={styles.corridaValor}>R$ {pedidoAtual.valor?.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles.corridaInfo}>
              <View style={styles.infoPill}>
                <Ionicons name="cube-outline" size={12} color="#555" />
                <Text style={styles.infoTxt}>{pedidoAtual.servico}</Text>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="person-outline" size={12} color="#555" />
                <Text style={styles.infoTxt}>{pedidoAtual.cliente?.usuario?.nome}</Text>
              </View>
            </View>
            <View style={styles.rota}>
              <View style={styles.rotaItem}>
                <View style={[styles.rotaDot, { backgroundColor: '#111' }]} />
                <Text style={styles.rotaTxt}>{pedidoAtual.origem}</Text>
              </View>
              <View style={styles.rotaLine} />
              <View style={styles.rotaItem}>
                <View style={[styles.rotaDot, { backgroundColor: '#3B6D11' }]} />
                <Text style={styles.rotaTxt}>{pedidoAtual.destino}</Text>
              </View>
            </View>
            <View style={styles.btns}>
              <TouchableOpacity style={styles.btnRecusar} onPress={() => setPedidos(pedidos.slice(1))} activeOpacity={0.8}>
                <Text style={styles.btnRecusarTxt}>Recusar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnAceitar}
                onPress={() => handleAceitar(pedidoAtual.id)}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Text style={styles.btnAceitarTxt}>Aceitar corrida</Text>
                      <Ionicons name="chevron-forward" size={16} color="#fff" />
                    </>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}

        {online && !pedidoAtual && (
          <View style={styles.offlineCard}>
            <Ionicons name="search-outline" size={28} color="#CCC" />
            <Text style={styles.offlineTxt}>Procurando corridas...</Text>
            <Text style={styles.offlineSub}>Você será notificado quando houver pedidos</Text>
          </View>
        )}

        {!online && (
          <View style={styles.offlineCard}>
            <Ionicons name="power-outline" size={28} color="#CCC" />
            <Text style={styles.offlineTxt}>Você está offline</Text>
            <Text style={styles.offlineSub}>Ative o modo online para receber corridas</Text>
          </View>
        )}

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
  },
  headerCenter: { flex: 1 },
  greeting: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  name: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 2 },
  toggleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { fontSize: 11, fontWeight: '600' },
  toggle: { width: 44, height: 24, borderRadius: 99, justifyContent: 'center', paddingHorizontal: 3 },
  toggleDot: {
    width: 18, height: 18, borderRadius: 99, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
  },
  toggleDotOn: { alignSelf: 'flex-end' },
  mapContainer: { flex: 1, position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  earningsStrip: {
    position: 'absolute', top: 12, left: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14,
    padding: 12, flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  earnItem: { flex: 1, alignItems: 'center', gap: 2 },
  earnDivider: { width: 1, backgroundColor: '#F0F0F0' },
  earnLabel: { fontSize: 9, color: '#AAA', fontWeight: '500' },
  earnValue: { fontSize: 14, fontWeight: '700', color: '#111' },
  corridaCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 18, paddingBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10, gap: 12,
  },
  corridaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  corridaBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: '#3B6D11' },
  badgeTxt: { fontSize: 12, fontWeight: '700', color: '#111' },
  corridaValor: { fontSize: 20, fontWeight: '800', color: '#111' },
  corridaInfo: { flexDirection: 'row', gap: 6 },
  infoPill: {
    backgroundColor: '#F4F4F4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  infoTxt: { fontSize: 10, fontWeight: '600', color: '#555' },
  rota: { gap: 4 },
  rotaItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rotaDot: { width: 8, height: 8, borderRadius: 99, flexShrink: 0 },
  rotaTxt: { fontSize: 11, color: '#555', flex: 1 },
  rotaLine: { width: 1, height: 12, backgroundColor: '#E0E0E0', marginLeft: 3.5 },
  btns: { flexDirection: 'row', gap: 10 },
  btnRecusar: {
    flex: 1, borderRadius: 13, padding: 14, borderWidth: 1.5, borderColor: '#EBEBEB',
    alignItems: 'center', justifyContent: 'center',
  },
  btnRecusarTxt: { fontSize: 13, fontWeight: '600', color: '#AAA' },
  btnAceitar: {
    flex: 2, borderRadius: 13, padding: 14, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  btnAceitarTxt: { fontSize: 13, fontWeight: '700', color: '#fff' },
  offlineCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 28, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10,
  },
  offlineTxt: { fontSize: 16, fontWeight: '700', color: '#CCC', marginTop: 4 },
  offlineSub: { fontSize: 12, color: '#DDD', textAlign: 'center' },
});