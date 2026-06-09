import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

const SERVICOS = [
  { id: 'entrega', nome: 'Entrega Express', desc: 'Pacotes e mercadorias', icon: 'cube-outline' },
  { id: 'documentos', nome: 'Documentos', desc: 'Cartórios e bancos', icon: 'document-text-outline' },
  { id: 'mototaxi', nome: 'Mototáxi', desc: 'Transporte de passageiro', icon: 'person-outline' },
  { id: 'pecas', nome: 'Peças e Insumos', desc: 'Autopeças e materiais', icon: 'construct-outline' },
];

export default function HomeClienteScreen() {
  const [servicoSelecionado, setServicoSelecionado] = useState('entrega');
  const [maquinaAtivada, setMaquinaAtivada] = useState(false);

  const irParaEnderecos = () => {
    router.push({
      pathname: '/definir-endereco' as any,
      params: {
        servico: servicoSelecionado,
        maquina: maquinaAtivada ? '1' : '0',
      },
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.container}>

        <SafeAreaView>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Olá, João</Text>
                <Text style={styles.title}>O que você precisa?</Text>
                <Text style={styles.sub}>Escolha o tipo de serviço</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/perfil-cliente' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="person-circle-outline" size={36} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

          <Text style={styles.sectionLabel}>Tipo de serviço</Text>

          <View style={styles.grid}>
            {SERVICOS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.serviceCard, servicoSelecionado === s.id && styles.serviceCardActive]}
                onPress={() => setServicoSelecionado(s.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.serviceIcon, servicoSelecionado === s.id && styles.serviceIconActive]}>
                  <Ionicons name={s.icon as any} size={20} color={servicoSelecionado === s.id ? '#fff' : '#555'} />
                </View>
                <View>
                  <Text style={styles.serviceName}>{s.nome}</Text>
                  <Text style={styles.serviceDesc}>{s.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Opções adicionais</Text>

          <View style={styles.maquinaCard}>
            <View style={styles.maquinaTop}>
              <View style={styles.maquinaIcon}>
                <MaterialCommunityIcons name="credit-card-outline" size={22} color="#333" />
              </View>
              <View style={styles.maquinaInfo}>
                <Text style={styles.maquinaTitle}>Levar máquina de cartão</Text>
                <Text style={styles.maquinaSub}>
                  {maquinaAtivada ? 'Ativado — taxa adicional aplicada' : 'O motoboy leva a máquina ao destino'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, maquinaAtivada && styles.toggleOn]}
                onPress={() => setMaquinaAtivada(!maquinaAtivada)}
                activeOpacity={0.8}
              >
                <View style={[styles.toggleDot, maquinaAtivada && styles.toggleDotOn]} />
              </TouchableOpacity>
            </View>

            {maquinaAtivada && (
              <View style={styles.alert}>
                <Ionicons name="information-circle-outline" size={16} color="#C89000" style={{ marginTop: 1 }} />
                <Text style={styles.alertTxt}>
                  <Text style={styles.alertBold}>O valor será maior. </Text>
                  O motoboy irá retirar a máquina, realizar a cobrança no destino e devolvê-la ao estabelecimento.
                </Text>
              </View>
            )}
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} activeOpacity={0.85} onPress={irParaEnderecos}>
            <Text style={styles.nextTxt}>Definir endereços</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 2 },
  sub: { fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3 },
  body: { flex: 1 },
  bodyContent: { padding: 18, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  serviceCard: { width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 10, borderWidth: 1.5, borderColor: '#EBEBEB' },
  serviceCardActive: { borderColor: '#111' },
  serviceIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' },
  serviceIconActive: { backgroundColor: '#111' },
  serviceName: { fontSize: 12, fontWeight: '700', color: '#111' },
  serviceDesc: { fontSize: 10, color: '#BBB', marginTop: 2, lineHeight: 14 },
  maquinaCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 4 },
  maquinaTop: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  maquinaIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' },
  maquinaInfo: { flex: 1 },
  maquinaTitle: { fontSize: 13, fontWeight: '700', color: '#111' },
  maquinaSub: { fontSize: 10, color: '#AAA', marginTop: 2 },
  toggle: { width: 42, height: 24, borderRadius: 99, backgroundColor: '#EBEBEB', justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn: { backgroundColor: '#111' },
  toggleDot: { width: 18, height: 18, borderRadius: 99, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  toggleDotOn: { alignSelf: 'flex-end' },
  alert: { backgroundColor: '#FFF8E6', borderTopWidth: 1, borderTopColor: '#FFE4A0', padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  alertTxt: { flex: 1, fontSize: 11, color: '#7A5C00', lineHeight: 16 },
  alertBold: { fontWeight: '700' },
  footer: { padding: 18, paddingTop: 10, backgroundColor: '#F8F8F8' },
  nextBtn: { backgroundColor: '#111', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});