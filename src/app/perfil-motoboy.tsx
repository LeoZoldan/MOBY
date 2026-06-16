import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { getMe, logout, minhasCorridas } from '../services/api';

const TROFEUS = [
  { id: 'iniciante',    nome: 'Iniciante',   desc: 'Primeiras 5 corridas',        icon: 'star',            cor: '#F5A623', bg: '#FFF8E6', border: '#F5A623', minCorridas: 5   },
  { id: 'veloz',        nome: 'Veloz',        desc: '10 entregas sem atraso',      icon: 'flash',           cor: '#4A9EFF', bg: '#E8F4FF', border: '#4A9EFF', minCorridas: 10  },
  { id: 'preciso',      nome: 'Preciso',      desc: '20 entregas sem cancelar',    icon: 'checkmark-circle',cor: '#3B6D11', bg: '#EAF3DE', border: '#3B6D11', minCorridas: 20  },
  { id: 'top',          nome: 'Top Motoboy',  desc: 'Média 4.8+ com 50 corridas', icon: 'trophy',          cor: '#F5A623', bg: '#FFF8E6', border: '#F5A623', minCorridas: 50  },
  { id: 'comunicativo', nome: 'Comunicativo', desc: '30 feedbacks no chat',        icon: 'chatbubbles',     cor: '#4A9EFF', bg: '#E8F4FF', border: '#4A9EFF', minCorridas: 30  },
  { id: 'lenda',        nome: 'Lenda',        desc: 'Média 4.9+ com 100 corridas',icon: 'ribbon',          cor: '#F5A623', bg: '#FFF8E6', border: '#F5A623', minCorridas: 100 },
  { id: 'pioneiro',     nome: 'Pioneiro',     desc: 'Um dos primeiros motoboys',   icon: 'shield-checkmark',cor: '#9B59B6', bg: '#F3E8FF', border: '#9B59B6', minCorridas: 1   },
  { id: 'favorito',     nome: 'Favorito',     desc: 'Cliente pediu 3x seguidas',  icon: 'heart',           cor: '#E24B4A', bg: '#FFE8EE', border: '#E24B4A', minCorridas: 3   },
  { id: 'maratonista',  nome: 'Maratonista',  desc: '50 corridas em um mês',      icon: 'flame',           cor: '#FF6500', bg: '#FFF3E8', border: '#FF6500', minCorridas: 50  },
];

export default function PerfilMotoboyScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [corridas, setCorridas] = useState<any[]>([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    getMe().then(setUsuario);
    minhasCorridas().then((data) => {
      if (Array.isArray(data)) {
        const entregues = data.filter((c: any) => c.status === 'entregue');
        setCorridas(entregues);
        const total = entregues.reduce((acc: number, c: any) => acc + (c.valor || 0), 0);
        setSaldo(total);
      }
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/' as any);
  };

  const trofeus = TROFEUS.map(t => ({
    ...t,
    desbloqueado: corridas.length >= t.minCorridas,
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
              <View style={styles.avatarBadge}>
                <Ionicons name="star" size={10} color="#fff" />
              </View>
            </View>
            <Text style={styles.nome}>{usuario?.nome || 'Carregando...'}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F5A623" />
              <Text style={styles.ratingTxt}>5.0</Text>
              <Text style={styles.sub}>· Motoboy MOBY</Text>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

          <View style={styles.stats}>
            <View style={styles.stat}><Text style={[styles.statVal, { color: '#3B6D11' }]}>R$ {saldo.toFixed(0)}</Text><Text style={styles.statLabel}>Saldo</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statVal}>{corridas.length}</Text><Text style={styles.statLabel}>Corridas</Text></View>
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

          <TouchableOpacity
            style={styles.btnSaque}
            onPress={() => router.push('/saque' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-up-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnSaqueTxt}>Sacar saldo — R$ {saldo.toFixed(2).replace('.', ',')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnEdit} onPress={() => router.push('/editar-perfil-motoboy' as any)} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={16} color="#111" />
            <Text style={styles.btnEditTxt}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#E24B4A" />
            <Text style={styles.btnLogoutTxt}>Sair da conta</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, alignItems: 'center', gap: 7 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginBottom: 8 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 99, backgroundColor: '#333', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  avatarBadge: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 99, backgroundColor: '#F5A623', borderWidth: 2, borderColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 17, fontWeight: '700', color: '#fff' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: { fontSize: 12, fontWeight: '600', color: '#F5A623' },
  sub: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  trofeuWrap: { width: '28%', alignItems: 'center', gap: 6 },
  trofeuCircle: { width: 64, height: 64, borderRadius: 99, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  trofeuCircleOff: { backgroundColor: '#F4F4F4', borderColor: '#E0E0E0' },
  trofeuNome: { fontSize: 10, fontWeight: '700', color: '#111', textAlign: 'center', lineHeight: 13 },
  trofeuNomeOff: { color: '#CCC' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 10, color: '#AAA' },
  rowVal: { fontSize: 13, fontWeight: '600', color: '#111', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#F4F4F4' },
  btnSaque: { backgroundColor: '#3B6D11', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnSaqueTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnEdit: { backgroundColor: '#F7F7F7', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#EBEBEB' },
  btnEditTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  btnLogout: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#EBEBEB' },
  btnLogoutTxt: { fontSize: 14, fontWeight: '600', color: '#E24B4A' },
});