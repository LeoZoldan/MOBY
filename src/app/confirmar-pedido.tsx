import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { criarPedido } from '../services/api';

const SERVICOS: Record<string, { nome: string; desc: string; icon: string; preco: number }> = {
  entrega:    { nome: 'Entrega Express', desc: 'Pacotes e mercadorias',     icon: 'cube-outline',          preco: 12 },
  documentos: { nome: 'Documentos',     desc: 'Cartórios e bancos',         icon: 'document-text-outline', preco: 14 },
  mototaxi:   { nome: 'Mototáxi',       desc: 'Transporte de passageiro',   icon: 'person-outline',        preco: 10 },
  pecas:      { nome: 'Peças e Insumos',desc: 'Autopeças e materiais',      icon: 'construct-outline',     preco: 16 },
};

const TAXA_MAQUINA = 6;

const PAGAMENTOS = [
  { id: 'cartao', nome: 'Cartão de crédito', icon: 'card-outline' },
  { id: 'pix',    nome: 'PIX',               icon: 'flash-outline' },
  { id: 'dinheiro', nome: 'Dinheiro',        icon: 'cash-outline' },
];

export default function ConfirmarPedidoScreen() {
  const params = useLocalSearchParams();
  const servico = String(params.servico || 'entrega');
  const maquina = String(params.maquina || '0');
  const origem = String(params.origem || '');
  const destino = String(params.destino || '');

  const [pagamento, setPagamento] = useState('cartao');
  const [loading, setLoading] = useState(false);

  const temMaquina = maquina === '1';
  const servicoInfo = SERVICOS[servico] ?? SERVICOS.entrega;
  const total = servicoInfo.preco + (temMaquina ? TAXA_MAQUINA : 0);

  const solicitar = async () => {
    setLoading(true);
    try {
      const data = await criarPedido({
        servico,
        origem: origem || 'Origem não informada',
        destino: destino || 'Destino não informado',
        valor: total,
        maquina: temMaquina,
      });

      if (data.erro) {
        Alert.alert('Erro', data.erro);
        return;
      }

      router.replace('/aguardando-motoboy' as any);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível criar o pedido');
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Confirmar pedido</Text>
            <Text style={styles.sub}>Revise antes de solicitar</Text>
          </View>
        </SafeAreaView>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Serviço</Text>
            <View style={styles.servicoRow}>
              <View style={styles.servicoIcon}>
                <Ionicons name={servicoInfo.icon as any} size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.servicoNome}>{servicoInfo.nome}</Text>
                <Text style={styles.servicoDesc}>{servicoInfo.desc}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rota</Text>
            <View style={styles.rota}>
              <View style={styles.rotaItem}>
                <View style={[styles.rotaDot, { backgroundColor: '#111' }]} />
                <Text style={styles.rotaTxt}>{origem || 'Origem não informada'}</Text>
              </View>
              <View style={styles.rotaLine} />
              <View style={styles.rotaItem}>
                <View style={[styles.rotaDot, { backgroundColor: '#3B6D11' }]} />
                <Text style={styles.rotaTxt}>{destino || 'Destino não informado'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo de valores</Text>
            <View style={styles.valorRows}>
              <View style={styles.valorRow}>
                <Text style={styles.valorLabel}>{servicoInfo.nome}</Text>
                <Text style={styles.valorVal}>R$ {servicoInfo.preco.toFixed(2).replace('.', ',')}</Text>
              </View>
              {temMaquina && (
                <View style={styles.valorRow}>
                  <Text style={styles.valorLabel}>Máquina de cartão</Text>
                  <Text style={styles.valorVal}>R$ {TAXA_MAQUINA.toFixed(2).replace('.', ',')}</Text>
                </View>
              )}
              <View style={styles.valorDivider} />
              <View style={styles.valorRow}>
                <Text style={styles.valorTotalLabel}>Total</Text>
                <Text style={styles.valorTotalVal}>R$ {total.toFixed(2).replace('.', ',')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Forma de pagamento</Text>
            <View style={styles.pagOpts}>
              {PAGAMENTOS.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pagOpt, pagamento === p.id && styles.pagOptActive]}
                  onPress={() => setPagamento(p.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.pagIcon}>
                    <Ionicons name={p.icon as any} size={18} color="#333" />
                  </View>
                  <Text style={styles.pagNome}>{p.nome}</Text>
                  <View style={[styles.radio, pagamento === p.id && styles.radioOn]}>
                    {pagamento === p.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={solicitar} activeOpacity={0.85} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Text style={styles.btnTxt}>Solicitar agora</Text>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </>
            }
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, gap: 4 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EBEBEB' },
  cardTitle: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 },
  servicoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  servicoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  servicoNome: { fontSize: 14, fontWeight: '700', color: '#111' },
  servicoDesc: { fontSize: 10, color: '#BBB', marginTop: 2 },
  rota: { gap: 4 },
  rotaItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rotaDot: { width: 8, height: 8, borderRadius: 99, flexShrink: 0 },
  rotaTxt: { fontSize: 12, color: '#555', flex: 1 },
  rotaLine: { width: 1, height: 12, backgroundColor: '#E0E0E0', marginLeft: 3.5 },
  valorRows: { gap: 10 },
  valorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valorLabel: { fontSize: 12, color: '#999' },
  valorVal: { fontSize: 12, color: '#111', fontWeight: '600' },
  valorDivider: { height: 1, backgroundColor: '#F0F0F0' },
  valorTotalLabel: { fontSize: 14, fontWeight: '700', color: '#111' },
  valorTotalVal: { fontSize: 18, fontWeight: '800', color: '#111' },
  pagOpts: { gap: 8 },
  pagOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#EBEBEB' },
  pagOptActive: { borderColor: '#111', backgroundColor: '#F7F7F7' },
  pagIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' },
  pagNome: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111' },
  radio: { width: 18, height: 18, borderRadius: 99, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: '#111', backgroundColor: '#111' },
  radioDot: { width: 7, height: 7, borderRadius: 99, backgroundColor: '#fff' },
  footer: { padding: 16, paddingBottom: 28 },
  btn: { backgroundColor: '#111', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});