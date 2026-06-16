import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
  ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { getMe } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.5.102:3000';

export default function EditarPerfilMotoboyScreen() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [pix, setPix] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMe().then((data) => {
      if (data) {
        setNome(data.nome || '');
        setTelefone(data.telefone || '');
        setEmail(data.email || '');
      }
    });
  }, []);

  const salvar = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const body: any = { nome, telefone, email };
      if (senha) body.senha = senha;
      if (pix) body.chavePix = pix;

      const res = await fetch(`${BASE_URL}/auth/atualizar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.erro) {
        Alert.alert('Erro', data.erro);
        return;
      }

      Alert.alert('Sucesso', 'Perfil atualizado!');
      router.back();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>

          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.backTxt}>Voltar</Text>
              </TouchableOpacity>
              <View style={styles.avatarWrap}>
                <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
                  <Ionicons name="person-outline" size={30} color="rgba(255,255,255,0.5)" />
                  <View style={styles.avatarEdit}>
                    <Ionicons name="camera-outline" size={11} color="#333" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.avatarLabel}>Toque para alterar foto</Text>
              </View>
            </View>
          </SafeAreaView>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dados pessoais</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Nome</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} autoCapitalize="words" placeholderTextColor="#CCC" />
              </View>
              <View style={styles.divider} />
              <View style={styles.field}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" maxLength={15} placeholderTextColor="#CCC" />
              </View>
              <View style={styles.divider} />
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#CCC" />
              </View>
              <View style={styles.divider} />
              <View style={styles.field}>
                <Text style={styles.label}>Chave PIX</Text>
                <TextInput style={styles.input} value={pix} onChangeText={setPix} autoCapitalize="none" placeholder="CPF, email ou telefone" placeholderTextColor="#CCC" />
              </View>
              <View style={styles.divider} />
              <View style={styles.field}>
                <Text style={styles.label}>Nova senha</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, borderWidth: 0 }]}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Deixe em branco para manter"
                    placeholderTextColor="#CCC"
                    secureTextEntry={!verSenha}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setVerSenha(!verSenha)}>
                    <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color="#AAA" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.lockedCard} activeOpacity={0.7}>
              <View style={styles.lockedIcon}>
                <Ionicons name="lock-closed-outline" size={16} color="#AAA" />
              </View>
              <View style={styles.lockedInfo}>
                <Text style={styles.lockedTitle}>Moto e documentos</Text>
                <Text style={styles.lockedSub}>Entre em contato com o suporte para alterar</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCC" />
            </TouchableOpacity>

          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnSalvar} onPress={salvar} activeOpacity={0.85} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="checkmark-outline" size={18} color="#fff" />
                    <Text style={styles.btnSalvarTxt}>Salvar alterações</Text>
                  </>
              }
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, gap: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  avatarWrap: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 99, backgroundColor: '#333',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEdit: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 99,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  avatarLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EBEBEB', gap: 10 },
  cardTitle: { fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  field: { gap: 5 },
  label: { fontSize: 10, fontWeight: '600', color: '#AAA', textTransform: 'uppercase', letterSpacing: 0.3 },
  input: { backgroundColor: '#F7F7F7', borderRadius: 11, padding: 11, fontSize: 13, color: '#111', borderWidth: 1, borderColor: '#EBEBEB' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F7F7', borderRadius: 11, borderWidth: 1, borderColor: '#EBEBEB', paddingRight: 10 },
  eyeBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: '#F4F4F4' },
  lockedCard: {
    backgroundColor: '#F7F7F7', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  lockedIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center' },
  lockedInfo: { flex: 1 },
  lockedTitle: { fontSize: 13, fontWeight: '600', color: '#AAA' },
  lockedSub: { fontSize: 10, color: '#CCC', marginTop: 2 },
  footer: { padding: 16, paddingBottom: 32 },
  btnSalvar: {
    backgroundColor: '#111', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnSalvarTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});