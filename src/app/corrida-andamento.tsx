import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
  Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

const MSGS_INICIAIS = [
  { id: 1, tipo: 'recv', texto: 'Estou a caminho! Chego em 5 minutos' },
  { id: 2, tipo: 'sent', texto: 'Ótimo, obrigado!' },
  { id: 3, tipo: 'recv', texto: 'Já coletei o pedido' },
];

const STATUS_STEPS = ['Aceito', 'Coletou', 'Entregou'];

export default function CorridaAndamentoScreen() {
  const [chatAberto, setChatAberto] = useState(false);
  const [msgs, setMsgs] = useState(MSGS_INICIAIS);
  const [inputMsg, setInputMsg] = useState('');
  const [stepAtual] = useState(1);

  const enviarMsg = () => {
    if (!inputMsg.trim()) return;
    setMsgs([...msgs, { id: msgs.length + 1, tipo: 'sent', texto: inputMsg }]);
    setInputMsg('');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E8E4" />
      <View style={styles.container}>

        <View style={styles.map}>
          <Ionicons name="map-outline" size={32} color="#CCC" />
          <Text style={styles.mapTxt}>Mapa disponível no celular</Text>
          <View style={styles.mbPinGreen as any}>
            <MaterialCommunityIcons name="moped" size={14} color="#fff" />
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.motoboyCard}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={20} color="#999" />
            </View>
            <View style={styles.mbDados}>
              <Text style={styles.mbNome}>Carlos Motoboy</Text>
              <Text style={styles.mbPlaca}>ABC-1234 · Honda CG 160</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F5A623" />
                <Text style={styles.ratingTxt}>4.9</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatIconBtn} onPress={() => setChatAberto(true)} activeOpacity={0.85}>
              <Ionicons name="chatbubble-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.steps}>
            {STATUS_STEPS.map((s, i) => (
              <View key={s} style={styles.stepWrap}>
                <View style={[styles.stepCircle, i <= stepAtual && styles.stepCircleOn]}>
                  {i <= stepAtual
                    ? <Ionicons name="checkmark" size={12} color="#fff" />
                    : <View style={styles.stepDot} />
                  }
                </View>
                <Text style={[styles.stepLabel, i <= stepAtual && styles.stepLabelOn]}>{s}</Text>
                {i < STATUS_STEPS.length - 1 && (
                  <View style={[styles.stepLine, i < stepAtual && styles.stepLineOn]} />
                )}
              </View>
            ))}
          </View>

          <View style={styles.btns}>
            <TouchableOpacity style={styles.btnChat} onPress={() => setChatAberto(true)} activeOpacity={0.85}>
              <Ionicons name="chatbubble-outline" size={16} color="#111" />
              <Text style={styles.btnChatTxt}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={styles.btnCancelarTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={chatAberto} animationType="slide" transparent>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.chatOverlay}>
              <TouchableOpacity style={styles.chatBackdrop} onPress={() => setChatAberto(false)} />
              <View style={styles.chatModal}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>Chat com Carlos</Text>
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
  map: {
    flex: 1, backgroundColor: '#E8E8E4', alignItems: 'center',
    justifyContent: 'center', gap: 8, position: 'relative',
  },
  mapTxt: { fontSize: 13, color: '#AAA' },
  mbPinGreen: {
    position: 'absolute', top: '35%', left: '40%',
    width: 32, height: 32, borderRadius: 99, backgroundColor: '#3B6D11',
    borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 18, paddingBottom: 32, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  motoboyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F7F7F7', borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  avatar: { width: 44, height: 44, borderRadius: 99, backgroundColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  mbDados: { flex: 1 },
  mbNome: { fontSize: 13, fontWeight: '700', color: '#111' },
  mbPlaca: { fontSize: 10, color: '#BBB', marginTop: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  ratingTxt: { fontSize: 11, color: '#F5A623', fontWeight: '600' },
  chatIconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  steps: { flexDirection: 'row', alignItems: 'flex-start' },
  stepWrap: { flex: 1, alignItems: 'center', position: 'relative' },
  stepCircle: { width: 24, height: 24, borderRadius: 99, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepCircleOn: { backgroundColor: '#111' },
  stepDot: { width: 6, height: 6, borderRadius: 99, backgroundColor: '#CCC' },
  stepLabel: { fontSize: 9, color: '#BBB', textAlign: 'center' },
  stepLabelOn: { color: '#111', fontWeight: '600' },
  stepLine: { position: 'absolute', top: 11, left: '50%', right: '-50%', height: 2, backgroundColor: '#EBEBEB' },
  stepLineOn: { backgroundColor: '#111' },
  btns: { flexDirection: 'row', gap: 10 },
  btnChat: {
    flex: 1, backgroundColor: '#F7F7F7', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 1, borderColor: '#EBEBEB',
  },
  btnChatTxt: { fontSize: 13, fontWeight: '600', color: '#111' },
  btnCancelar: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#EBEBEB' },
  btnCancelarTxt: { fontSize: 13, fontWeight: '600', color: '#AAA' },
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