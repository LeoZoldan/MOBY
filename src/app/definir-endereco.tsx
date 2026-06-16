import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

const BASE_URL = 'http://192.168.5.102:3000';

const PRECOS_SERVICO: Record<string, number> = {
  entrega: 11,
  documentos: 11,
  mototaxi: 11,
  pecas: 11,
};

const TAXA_MAQUINA = 6;

export default function DefinirEnderecoScreen() {
  const params = useLocalSearchParams();
  const servico = String(params.servico || 'entrega');
  const maquina = String(params.maquina || '0');

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [inputAtivo, setInputAtivo] = useState<'origem' | 'destino'>('origem');
  const [valorZona, setValorZona] = useState<number | null>(null);
  const [intermunicipal, setIntermunicipal] = useState(false);
  const [detectando, setDetectando] = useState(false);

  useEffect(() => {
    if (destino.length > 5) {
      const timeout = setTimeout(() => detectarZona(), 800);
      return () => clearTimeout(timeout);
    } else {
      setValorZona(null);
      setIntermunicipal(false);
    }
  }, [destino]);

  const detectarZona = async () => {
    setDetectando(true);
    try {
      const res = await fetch(`${BASE_URL}/zonas/detectar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destino, cidadeOrigem: 'Tapejara' }),
      });
      const data = await res.json();
      if (data.intermunicipal) {
        setIntermunicipal(true);
        setValorZona(null);
      } else if (data.valor) {
        setValorZona(data.valor);
        setIntermunicipal(false);
      } else {
        setValorZona(PRECOS_SERVICO[servico] || 11);
        setIntermunicipal(false);
      }
    } catch (err) {
      setValorZona(PRECOS_SERVICO[servico] || 11);
    } finally {
      setDetectando(false);
    }
  };

  const valorFinal = valorZona
    ? valorZona + (maquina === '1' ? TAXA_MAQUINA : 0)
    : PRECOS_SERVICO[servico] + (maquina === '1' ? TAXA_MAQUINA : 0);

  const confirmar = () => {
    if (!origem || !destino) return;
    router.push({
      pathname: '/confirmar-pedido' as any,
      params: { servico, maquina, origem, destino, valor: String(valorFinal) },
    });
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
            <Text style={styles.title}>Onde e para onde?</Text>
            <Text style={styles.sub}>Defina a origem e o destino</Text>
          </View>
        </SafeAreaView>

        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={36} color="#CCC" />
          <Text style={styles.mapPlaceholderTxt}>Mapa disponível no celular</Text>
          <Text style={styles.mapPlaceholderSub}>Build nativo necessário</Text>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.addressCard}>
            <TouchableOpacity
              style={[styles.addressRow, inputAtivo === 'origem' && styles.addressRowActive]}
              onPress={() => setInputAtivo('origem')}
              activeOpacity={0.9}
            >
              <View style={[styles.addressDot, { backgroundColor: '#111' }]} />
              <View style={styles.addressInput}>
                <Text style={styles.addressLabel}>Origem</Text>
                <TextInput
                  style={styles.addressValue}
                  placeholder="De onde sai?"
                  placeholderTextColor="#CCC"
                  value={origem}
                  onChangeText={setOrigem}
                  onFocus={() => setInputAtivo('origem')}
                />
              </View>
              {origem
                ? <TouchableOpacity onPress={() => setOrigem('')}><Ionicons name="close-circle" size={18} color="#CCC" /></TouchableOpacity>
                : <Ionicons name="location-outline" size={18} color="#CCC" />
              }
            </TouchableOpacity>

            <View style={styles.addressDivider} />

            <TouchableOpacity
              style={[styles.addressRow, inputAtivo === 'destino' && styles.addressRowActive]}
              onPress={() => setInputAtivo('destino')}
              activeOpacity={0.9}
            >
              <View style={[styles.addressDot, { backgroundColor: '#3B6D11' }]} />
              <View style={styles.addressInput}>
                <Text style={styles.addressLabel}>Destino</Text>
                <TextInput
                  style={styles.addressValue}
                  placeholder="Para onde vai?"
                  placeholderTextColor="#CCC"
                  value={destino}
                  onChangeText={setDestino}
                  onFocus={() => setInputAtivo('destino')}
                />
              </View>
              {destino
                ? <TouchableOpacity onPress={() => setDestino('')}><Ionicons name="close-circle" size={18} color="#CCC" /></TouchableOpacity>
                : <Ionicons name="search-outline" size={18} color="#CCC" />
              }
            </TouchableOpacity>
          </View>

          {origem && destino && (
            <View style={styles.infoRow}>
              <View style={styles.infoPill}>
                <Ionicons name="time-outline" size={14} color="#555" />
                <View>
                  <Text style={styles.pillLabel}>Tempo</Text>
                  <Text style={styles.pillValue}>~12 min</Text>
                </View>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="location-outline" size={14} color="#555" />
                <View>
                  <Text style={styles.pillLabel}>Zona</Text>
                  <Text style={styles.pillValue}>{detectando ? '...' : intermunicipal ? 'Intermunic.' : 'Local'}</Text>
                </View>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="cash-outline" size={14} color="#555" />
                <View>
                  <Text style={styles.pillLabel}>Valor est.</Text>
                  <Text style={styles.pillValue}>
                    {detectando ? '...' : intermunicipal ? 'Por km' : `R$ ${valorFinal}`}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {intermunicipal && (
            <View style={styles.alertBox}>
              <Ionicons name="information-circle-outline" size={16} color="#C89000" />
              <Text style={styles.alertTxt}>Destino intermunicipal — valor calculado por km (R$ 1,50/km ida e volta)</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmBtn, (!origem || !destino) && styles.confirmBtnDisabled]}
            onPress={confirmar}
            activeOpacity={0.85}
            disabled={!origem || !destino}
          >
            <Text style={styles.confirmTxt}>Confirmar pedido</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, gap: 4 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  mapPlaceholder: { flex: 1, backgroundColor: '#E8E8E4', alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapPlaceholderTxt: { fontSize: 14, color: '#AAA', fontWeight: '600' },
  mapPlaceholderSub: { fontSize: 11, color: '#CCC' },
  bottomSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 18, paddingBottom: 28, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  addressCard: { backgroundColor: '#F7F7F7', borderRadius: 14, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  addressRowActive: { backgroundColor: '#F0F0F0' },
  addressDot: { width: 10, height: 10, borderRadius: 99, flexShrink: 0 },
  addressInput: { flex: 1 },
  addressLabel: { fontSize: 9, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' },
  addressValue: { fontSize: 13, color: '#111', marginTop: 2, padding: 0 },
  addressDivider: { height: 1, backgroundColor: '#EBEBEB', marginLeft: 36 },
  infoRow: { flexDirection: 'row', gap: 8 },
  infoPill: { flex: 1, backgroundColor: '#F7F7F7', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#EBEBEB' },
  pillLabel: { fontSize: 9, color: '#AAA', fontWeight: '500' },
  pillValue: { fontSize: 12, fontWeight: '700', color: '#111' },
  alertBox: { backgroundColor: '#FFF8E6', borderRadius: 12, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start', borderWidth: 1, borderColor: '#FFE4A0' },
  alertTxt: { flex: 1, fontSize: 11, color: '#7A5C00', lineHeight: 16 },
  confirmBtn: { backgroundColor: '#111', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  confirmBtnDisabled: { backgroundColor: '#CCC' },
  confirmTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});