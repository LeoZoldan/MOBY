import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { getMe, logout, meusPedidos } from '../services/api';

const TROFEUS = [
  { id: 'fiel',     nome: 'Fiel',        desc: '10 pedidos realizados',  icon: 'heart',   cor: '#E24B4A', bg: '#FFE8EE', border: '#E24B4A', minPedidos: 10  },
  { id: 'avaliado', nome: 'Bem Avaliado',desc: 'Sempre deu 5 estrelas',  icon: 'star',    cor: '#F5A623', bg: '#FFF8E6', border: '#F5A623', minPedidos: 1  },
  { id: 'vip',      nome: 'VIP',         desc: '50 pedidos realizados',  icon: 'diamond', cor: '#4A9EFF', bg: '#E8F4FF', border: '#4A9EFF', minPedidos: 50 },
  { id: 'lendario', nome: 'Lendário',    desc: '100 pedidos realizados', icon: 'trophy',  cor: '#F5A623', bg: '#FFF8E6', border: '#F5A623', minPedidos: 100 },
];

const STATUS_LABEL: Record<string, { label: string; cor: string; bg: string }> = {
  aguardando: { label: 'Aguardando', cor: '#C89000', bg: '#FFF8E6' },
  aceito:     { label: 'Aceito',     cor: '#4A9EFF', bg: '#E8F4FF' },
  coletado:   { label: 'A caminho',  cor: '#9B59B6', bg: '#F3E8FF' },
  entregue:   { label: 'Entregue',   cor: '#3B6D11', bg: '#EAF3DE' },
  cancelado:  { label: 'Cancelado',  cor: '#E24B4A', bg: '#FFE8EE' },
};

export default function PerfilClienteScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [totalGasto, setTotalGasto] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'historico'>('perfil');

  useEffect(() => {
    getMe().then(setUsuario);
    meusPedidos().then((data) => {
      if (Array.isArray(data)) {
        setPedidos(data);
        const total = data.reduce((acc: number, p: any) => acc + (p.valor || 0), 0);
        setTotalGasto(total);
      }
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/' as any);
  };

  const trofeus = TROFEUS.map(t => ({
    ...t,
    desbloqueado: pedidos.length >= t.minPedidos,
  }));

  const desbloqueados = trofeus.filter(t => t.desbloqueado).length;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.5)" />
              <Text style={styles.backTxt}>Voltar</Text>
            </TouchableOpacity>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={32} color="rgba(255,255,255,0.5)" />
              </View>
            </View>
            <Text style={styles.nome}>{usuario?.nome || 'Carregando...'}</Text>
            <Text style={styles.sub}>Cliente MOBY</Text>

            <View style={styles.abas}>
              <TouchableOpacity
                style={[styles.aba, abaAtiva === 'perfil' && styles.abaAtiva]}
                onPress={() => setAbaAtiva('perfil')}
                activeOpacity={0.8}
              >
                <Text style={[styles.abaTxt, abaAtiva === 'perfil' && styles.abaTxtAtiva]}>Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.aba, abaAtiva === 'historico' && styles.abaAtiva]}
                onPress={() => setAbaAtiva('historico')}
                activeOpacity={0.8}
              >
                <Text style={[styles.abaTxt, abaAtiva === 'historico' && styles.abaTxtAtiva]}>Histórico</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

          {abaAtiva === 'perfil' && (
            <>
              <View style={styles.stats}>
                <View style={styles.stat}><Text style={styles.statVal}>{pedidos.length}</Text><Text style={styles.statLabel}>Pedidos</Text></View>
                <View style={styles.statDivider} />
                <View style={styles.stat}><Text style={[styles.statVal, { color: '#3B6D11' }]}>R$ {totalGasto.toFixed(0)}</Text><Text style={styles.statLabel}>Total gasto</Text></View>
                <View style={styles.statDivider} />
                <View style={styles.stat}><Text style={styles.statVal}>5.0</Text><Text style={styles.statLabel}>Avaliação</Text></View>
              </View>

              <View style={styles.card}>
                <View style={styles.conquistaHeader}>
                  <Text style={styles.cardTitle}>Conquistas</Text>
                  <Text style={styles.conquistaCount}>{desbloqueados} de {trofeus.length}</Text>
                </View>
                <View style={styles.grid}>
                  {trofeus.map((t) => (
                    <View key={t.id} style={styles.trofeuWrap}>
                      <View style={[styles.trofeuCircle, t.desbloqueado ? { backgroundColor: t.bg, borderColor: t.border } : styles.trofeuCircleOff]}>
                        <Ionicons name={t.icon as any} size={26} color={t.desbloqueado ? t.cor : '#CCC'} />
                      </View>
                      <Text style={[styles.trofeuNome, !t.desbloqueado && styles.trofeuNomeOff]}>{t.nome}</Text>
                      <Text style={styles.trofeuDesc}>{t.desc}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Dados pessoais</Text>
                <View style={styles.row}><View style={styles.rowIcon}><Ionicons name="person-outline" size={16} color="#555" /></View><View style={styles.rowInfo}><Text style={styles.rowLabel}>Nome</Text><Text style={styles.rowVal}>{usuario?.nome || '-'}</Text></View></View>
                <View style={styles.divider} />
                <View style={styles.row}><View style={styles.rowIcon}><Ionicons name="mail-outline" size={16} color="#555" /></View><View style={styles.rowInfo}><Text style={styles.rowLabel}>Email</Text><Text style={styles.rowVal}>{usuario?.email || '-'}</Text></View></View>
                <View style={styles.divider} />
                <View style={styles.row}><View style={styles.rowIcon}><Ionicons name="phone-portrait-outline" size={16} color="#555" /></View><View style={styles.rowInfo}><Text style={styles.rowLabel}>Telefone</Text><Text style={styles.rowVal}>{usuario?.telefone || '-'}</Text></View></View>
              </View>

              <TouchableOpacity style={styles.btnEdit} onPress={() => router.push('/editar-perfil-cliente' as any)} activeOpacity={0.8}>
                <Ionicons name="create-outline" size={16} color="#111" />
                <Text style={styles.btnEditTxt}>Editar perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={16} color="#E24B4A" />
                <Text style={styles.btnLogoutTxt}>Sair da conta</Text>
              </TouchableOpacity>
            </>
          )}

          {abaAtiva === 'historico' && (
            <>
              {pedidos.length === 0 ? (
                <View style={styles.vazioWrap}>
                  <Ionicons name="receipt-outline" size={48} color="#DDD" />
                  <Text style={styles.vazioTxt}>Nenhum pedido ainda</Text>
                  <Text style={styles.vazioSub}>Seus pedidos aparecem aqui</Text>
                </View>
              ) : (
                pedidos.map((p: any) => {
                  const s = STATUS_LABEL[p.status] || { label: p.status, cor: '#999', bg: '#F4F4F4' };
                  return (
                    <View key={p.id} style={styles.pedidoCard}>
                      <View style={styles.pedidoTop}>
                        <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                          <Text style={[styles.statusTxt, { color: s.cor }]}>{s.label}</Text>
                        </View>
                        <Text style={styles.pedidoValor}>R$ {p.valor?.toFixed(2).replace('.', ',')}</Text>
                      </View>
                      <View style={styles.pedidoRota}>
                        <View style={styles.pedidoRotaItem}>
                          <View style={[styles.rotaDot, { backgroundColor: '#111' }]} />
                          <Text style={styles.pedidoEndTxt} numberOfLines={1}>{p.origem}</Text>
                        </View>
                        <View style={styles.rotaLinha} />
                        <View style={styles.pedidoRotaItem}>
                          <View style={[styles.rotaDot, { backgroundColor: '#3B6D11' }]} />
                          <Text style={styles.pedidoEndTxt} numberOfLines={1}>{p.destino}</Text>
                        </View>
                      </View>
                      <View style={styles.pedidoBottom}>
                        <Text style={styles.pedidoServico}>{p.servico}</Text>
                        <Text style={styles.pedidoData}>
                          {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </>
          )}

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 0, alignItems: 'center', gap: 7 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginBottom: 8 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 99, backgroundColor: '#333', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 17, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  abas: { flexDirection: 'row', marginTop: 12, width: '100%' },
  aba: { flex: 1, alignItems: 'center', paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  abaAtiva: { borderBottomColor: '#fff' },
  abaTxt: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  abaTxtAtiva: { color: '#fff' },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  stats: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statVal: { fontSize: 18, fontWeight: '800', color: '#111' },
  statLabel: { fontSize: 10, color: '#BBB' },
  statDivider: { width: 1, height: 36, backgroundColor: '#F0F0F0' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EBEBEB', gap: 12 },
  cardTitle: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' },
  conquistaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  conquistaCount: { fontSize: 11, fontWeight: '600', color: '#BBB' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  trofeuWrap: { width: '44%', alignItems: 'center', gap: 5 },
  trofeuCircle: { width: 64, height: 64, borderRadius: 99, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  trofeuCircleOff: { backgroundColor: '#F4F4F4', borderColor: '#E0E0E0' },
  trofeuNome: { fontSize: 11, fontWeight: '700', color: '#111', textAlign: 'center' },
  trofeuNomeOff: { color: '#CCC' },
  trofeuDesc: { fontSize: 9, color: '#BBB', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 10, color: '#AAA' },
  rowVal: { fontSize: 13, fontWeight: '600', color: '#111', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#F4F4F4' },
  btnEdit: { backgroundColor: '#F7F7F7', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#EBEBEB' },
  btnEditTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  btnLogout: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#EBEBEB' },
  btnLogoutTxt: { fontSize: 14, fontWeight: '600', color: '#E24B4A' },
  vazioWrap: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  vazioTxt: { fontSize: 16, fontWeight: '700', color: '#CCC' },
  vazioSub: { fontSize: 12, color: '#DDD' },
  pedidoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EBEBEB', gap: 10 },
  pedidoTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusTxt: { fontSize: 11, fontWeight: '700' },
  pedidoValor: { fontSize: 15, fontWeight: '800', color: '#111' },
  pedidoRota: { gap: 4 },
  pedidoRotaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rotaDot: { width: 7, height: 7, borderRadius: 99, flexShrink: 0 },
  rotaLinha: { width: 1, height: 10, backgroundColor: '#E0E0E0', marginLeft: 3 },
  pedidoEndTxt: { fontSize: 11, color: '#555', flex: 1 },
  pedidoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pedidoServico: { fontSize: 10, color: '#AAA', fontWeight: '600', textTransform: 'uppercase' },
  pedidoData: { fontSize: 10, color: '#BBB' },
});