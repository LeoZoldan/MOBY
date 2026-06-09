import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
  Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

const MSGS_INICIAIS = [
  { id: 1, tipo: 'sent', texto: 'Estou a caminho! Chego em 3 minutos' },
  { id: 2, tipo: 'recv', texto: 'Ótimo, obrigado!' },
];

export default function MbACaminhoScreen() {
  const [chatAberto, setChatAberto] = useState(false);
  const [msgs, setMsgs] = useState(MSGS_INICIAIS);
  const [inputMsg, setInputMsg] = useState('');
  const [etapa, setEtapa] = useState<'coleta' | 'entrega'>('coleta');

  const enviarMsg = () => {
    if (!inputMsg.trim()) return;
    setMsgs([...msgs, { id: msgs.length + 1, tipo: 'sent', texto: inputMsg }]);
    setInputMsg('');
  };

  const confirmarColeta = () => setEtapa('entrega');
  const confirmarEntrega = () => router.replace('/mb-finalizada' as any);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E8E4" />
      <View style={styles.container}>

        <View style={styles.map}>
          <Ionicons name="map-outline" size={32} color="#CCC" />
          <Text style={styles.mapTxt}>Mapa disponível no celular</Text>
        </View>

        <View style={styles.sheet}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusTitle}>
                {etapa === 'coleta' ? 'A caminho da coleta' : 'Entregando'}
              </Text>
              <Text style={styles.statusSub}>
                {etapa === 'coleta' ? 'Rua das Flores, 123' : 'Av. Brasil, 456'}
              </Text>
            </View>
            <View style={styles.timer}>
              <Text style={styles.timerTxt}>{etapa === 'coleta' ? '3 min' : '8 min'}</Text>
            </View>
          </View>

          {etapa === 'entrega' && (
            <View style={styles.steps}>
              {['Aceito', 'Coletou', 'Entregou'].map((s, i) => (
                <View key={s} style={styles.stepWrap}>
                  <View style={[styles.stepCircle, i <= 1 && styles.stepCircleOn]}>
                    {i <= 1
                      ? <Ionicons name="checkmark" size={11} color="#fff" />
                      : <View style={styles.stepDot} />
                    }
                  </View>
                  <Text style={[styles.stepLabel, i <= 1 && styles.stepLabelOn]}>{s}</Text>
                  {i < 2 && <View style={[styles.stepLine, i < 1 && styles.stepLineOn]} />}
                </View>
              ))}
            </View>
          )}

          <View style={styles.clienteCard}>
            <View style={styles.cliAvatar}>
              <Ionicons name="person-outline" size={16} color="#999" />
            </View>
            <View style={styles.cliInfo}>
              <Text style={styles.cliNome}>João Silva</Text>
              <Text style={styles.cliEnd}>
                {etapa === 'coleta' ? 'Rua das Flores, 123' : 'Av. Brasil, 456'}
              </Text>
            </View>
            <TouchableOpacity style={styles.chatBtn} onPress={() => setChatAberto(true)} activeOpacity={0.85}>
              <Ionicons name="chatbubble-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnNavegar} activeOpacity={0.85}>
            <Ionicons name="navigate-outline" size={18} color="#fff" />
            <Text style={styles.btnNavegarTxt}>
              {etapa === 'coleta' ? 'Navegar até a coleta' : 'Navegar até a entrega'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnConfirmar}
            onPress={etapa === 'coleta' ? confirmarColeta : confirmarEntrega}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnConfirmarTxt}>
              {etapa === 'coleta' ? 'Confirmar coleta' : 'Confirmar entrega'}
            </Text>
          </TouchableOpacity>

        </View>

        <Modal visible={chatAberto} animationType="slide" transparent>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.chatOverlay}>
              <TouchableOpacity style={styles.chatBackdrop} onPress={() => setChatAberto(false)} />
              <View style={styles.chatModal}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>Chat com João</Text>
                  <TouchableOpacity style={styles.chatClose} onPress={() => setChatAberto(false)}>
                    <Ionicons name="close" size={16} color="#555" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.chatMsgs} contentContainerStyle={{ padding: 14, gap: 8 }}>
                  {msgs.map((m) => (
                    <View key={m.id} style={[styles.msg, m.tipo === 'sent' ? styles.msgSent : styles.msgRecv]}>
                      <Text style={m.tipo === 'sent' ? styles.msgSentTxt : styles.msgRecvTxt}>{m.texto}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.chatInputRow}>
                  <TextInput
                    style={styles.chatInput}
                    placeholder="Digite uma mensagem..."
                    placeholderTextColor="#CCC"
                    value={inputMsg}
                    onChangeText={setInputMsg}
                    onSubmitEditing={enviarMsg}
                    returnKeyType="send"
                  />
                  <TouchableOpacity style={styles.chatSend} onPress={enviarMsg} activeOpacity={0.85}>
                    <Ionicons name="send" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  map: { flex: 1, backgroundColor: '#E8E8E4', alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapTxt: { fontSize: 13, color: '#AAA' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22,
    padding: 18, paddingBottom: 32, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  statusHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  statusSub: { fontSize: 11, color: '#BBB', marginTop: 2 },
  timer: { backgroundColor: '#F4F4F4', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  timerTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  steps: { flexDirection: 'row', alignItems: 'flex-start' },
  stepWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  stepCircle: { width: 22, height: 22, borderRadius: 99, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  stepCircleOn: { backgroundColor: '#111' },
  stepDot: { width: 5, height: 5, borderRadius: 99, backgroundColor: '#CCC' },
  stepLabel: { fontSize: 8, color: '#BBB', textAlign: 'center' },
  stepLabelOn: { color: '#111', fontWeight: '600' },
  stepLine: { position: 'absolute', top: 10, left: '50%', right: '-50%', height: 2, backgroundColor: '#EBEBEB' },
  stepLineOn: { backgroundColor: '#111' },
  clienteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F7F7F7', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  cliAvatar: { width: 36, height: 36, borderRadius: 99, backgroundColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  cliInfo: { flex: 1 },
  cliNome: { fontSize: 12, fontWeight: '700', color: '#111' },
  cliEnd: { fontSize: 10, color: '#BBB', marginTop: 1 },
  chatBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  btnNavegar: {
    backgroundColor: '#111', borderRadius: 14, padding: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnNavegarTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnConfirmar: {
    backgroundColor: '#3B6D11', borderRadius: 14, padding: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnConfirmarTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
  chatOverlay: { flex: 1, justifyContent: 'flex-end' },
  chatBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  chatModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '75%' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  chatTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111' },
  chatClose: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center' },
  chatMsgs: { flex: 1 },
  msg: { maxWidth: '75%', padding: 10, borderRadius: 14 },
  msgRecv: { backgroundColor: '#F7F7F7', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  msgSent: { backgroundColor: '#111', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  msgRecvTxt: { fontSize: 13, color: '#111' },
  msgSentTxt: { fontSize: 13, color: '#fff' },
  chatInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  chatInput: {
    flex: 1, backgroundColor: '#F7F7F7', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: '#111',
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  chatSend: { width: 38, height: 38, borderRadius: 99, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
});