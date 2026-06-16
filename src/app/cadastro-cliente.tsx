import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { cadastrar } from '../services/api';

type TipoConta = 'fisica' | 'empresa';

export default function CadastroClienteScreen() {
  const [tipo, setTipo] = useState<TipoConta | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const TOTAL_STEPS = 2;

  const finalizar = async () => {
    setLoading(true);
    try {
      const endereco = `${rua}, ${numero}${complemento ? ` - ${complemento}` : ''}, ${bairro}, ${cidade} - ${estado}, ${cep}`;
      const dados = {
        nome: tipo === 'fisica' ? nome : responsavel,
        email,
        telefone,
        senha,
        tipo: 'cliente',
        tipoConta: tipo,
        documento: tipo === 'fisica' ? cpf : cnpj,
        endereco,
        ...(tipo === 'empresa' && { razaoSocial }),
      };

      const data = await cadastrar(dados);

      if (data.erro) {
        Alert.alert('Erro', data.erro);
        return;
      }

      router.replace('/home-cliente' as any);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const avancar = () => {
    if (step === 0 && tipo) setStep(1);
    else if (step < TOTAL_STEPS) setStep(step + 1);
    else finalizar();
  };

  const voltar = () => {
    if (step > 0) setStep(step - 1);
    else router.back();
  };

  const formatCpf = (text: string) => text.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  const formatNascimento = (text: string) => text.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 10);
  const formatTelefone = (text: string) => text.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
  const formatCNPJ = (text: string) => text.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2');
  const formatCEP = (text: string) => text.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
  const formatEstado = (text: string) => text.toUpperCase().replace(/[^A-Z]/g, '');

  const titulos = ['Tipo de conta', 'Dados pessoais', 'Endereço'];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>

          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={voltar} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.backTxt}>Voltar</Text>
              </TouchableOpacity>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{titulos[step]}</Text>
                <Text style={styles.stepSub}>{step === 0 ? 'Escolha seu perfil' : `Etapa ${step} de ${TOTAL_STEPS}`}</Text>
              </View>
              {step > 0 && (
                <View style={styles.progress}>
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: i < step ? '#fff' : 'rgba(255,255,255,0.2)' }]} />
                  ))}
                </View>
              )}
            </View>
          </SafeAreaView>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {step === 0 && (
              <View style={styles.tipoWrap}>
                <Text style={styles.tipoLabel}>Qual tipo de conta você precisa?</Text>
                <TouchableOpacity style={[styles.tipoCard, tipo === 'fisica' && styles.tipoCardActive]} onPress={() => setTipo('fisica')} activeOpacity={0.85}>
                  <View style={[styles.tipoIcon, tipo === 'fisica' ? styles.tipoIconActive : styles.tipoIconOff]}>
                    <Ionicons name="person-outline" size={22} color={tipo === 'fisica' ? '#fff' : '#999'} />
                  </View>
                  <View style={styles.tipoInfo}>
                    <Text style={styles.tipoNome}>Pessoa física</Text>
                    <Text style={styles.tipoDesc}>CPF, nome e telefone</Text>
                  </View>
                  <View style={[styles.radio, tipo === 'fisica' && styles.radioActive]}>
                    {tipo === 'fisica' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tipoCard, tipo === 'empresa' && styles.tipoCardActive]} onPress={() => setTipo('empresa')} activeOpacity={0.85}>
                  <View style={[styles.tipoIcon, tipo === 'empresa' ? styles.tipoIconActive : styles.tipoIconOff]}>
                    <Ionicons name="business-outline" size={22} color={tipo === 'empresa' ? '#fff' : '#999'} />
                  </View>
                  <View style={styles.tipoInfo}>
                    <Text style={styles.tipoNome}>MEI / Empresa</Text>
                    <Text style={styles.tipoDesc}>CNPJ e razão social</Text>
                  </View>
                  <View style={[styles.radio, tipo === 'empresa' && styles.radioActive]}>
                    {tipo === 'empresa' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {step === 1 && (
              <View style={styles.fields}>
                {tipo === 'fisica' ? (
                  <>
                    <View style={styles.field}><Text style={styles.label}>Nome completo</Text><TextInput style={styles.input} placeholder="João da Silva" placeholderTextColor="#CCC" value={nome} onChangeText={setNome} autoCapitalize="words" /></View>
                    <View style={styles.field}><Text style={styles.label}>CPF</Text><TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor="#CCC" value={cpf} onChangeText={(t) => setCpf(formatCpf(t))} keyboardType="numeric" maxLength={14} /></View>
                    <View style={styles.field}><Text style={styles.label}>Data de nascimento</Text><TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#CCC" value={nascimento} onChangeText={(t) => setNascimento(formatNascimento(t))} keyboardType="numeric" maxLength={10} /></View>
                  </>
                ) : (
                  <>
                    <View style={styles.field}><Text style={styles.label}>Razão social</Text><TextInput style={styles.input} placeholder="Empresa Ltda." placeholderTextColor="#CCC" value={razaoSocial} onChangeText={setRazaoSocial} autoCapitalize="words" /></View>
                    <View style={styles.field}><Text style={styles.label}>CNPJ</Text><TextInput style={styles.input} placeholder="00.000.000/0000-00" placeholderTextColor="#CCC" value={cnpj} onChangeText={(t) => setCnpj(formatCNPJ(t))} keyboardType="numeric" maxLength={18} /></View>
                    <View style={styles.field}><Text style={styles.label}>Nome do responsável</Text><TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#CCC" value={responsavel} onChangeText={setResponsavel} autoCapitalize="words" /></View>
                  </>
                )}
                <View style={styles.field}><Text style={styles.label}>Email</Text><TextInput style={styles.input} placeholder="email@exemplo.com" placeholderTextColor="#CCC" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
                <View style={styles.field}><Text style={styles.label}>Telefone</Text><TextInput style={styles.input} placeholder="(54) 99999-9999" placeholderTextColor="#CCC" value={telefone} onChangeText={(t) => setTelefone(formatTelefone(t))} keyboardType="phone-pad" maxLength={15} /></View>
                <View style={styles.field}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={[styles.input, { flex: 1, borderWidth: 0 }]} placeholder="Mínimo 8 caracteres" placeholderTextColor="#CCC" value={senha} onChangeText={setSenha} secureTextEntry={!verSenha} />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setVerSenha(!verSenha)}>
                      <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color="#AAA" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {step === 2 && (
              <View style={styles.fields}>
                <View style={styles.field}><Text style={styles.label}>CEP</Text><TextInput style={styles.input} placeholder="99999-000" placeholderTextColor="#CCC" value={cep} onChangeText={(t) => setCep(formatCEP(t))} keyboardType="numeric" maxLength={9} /></View>
                <View style={styles.field}><Text style={styles.label}>Rua</Text><TextInput style={styles.input} placeholder="Rua das Flores" placeholderTextColor="#CCC" value={rua} onChangeText={setRua} autoCapitalize="words" /></View>
                <View style={styles.rowFields}>
                  <View style={[styles.field, { flex: 1 }]}><Text style={styles.label}>Número</Text><TextInput style={styles.input} placeholder="123" placeholderTextColor="#CCC" value={numero} onChangeText={(t) => setNumero(t.replace(/\D/g, ''))} keyboardType="numeric" /></View>
                  <View style={[styles.field, { flex: 1.5 }]}><Text style={styles.label}>Complemento</Text><TextInput style={styles.input} placeholder="Apto 2 (opcional)" placeholderTextColor="#CCC" value={complemento} onChangeText={setComplemento} /></View>
                </View>
                <View style={styles.field}><Text style={styles.label}>Bairro</Text><TextInput style={styles.input} placeholder="Centro" placeholderTextColor="#CCC" value={bairro} onChangeText={setBairro} autoCapitalize="words" /></View>
                <View style={styles.rowFields}>
                  <View style={[styles.field, { flex: 1.5 }]}><Text style={styles.label}>Cidade</Text><TextInput style={styles.input} placeholder="Passo Fundo" placeholderTextColor="#CCC" value={cidade} onChangeText={setCidade} autoCapitalize="words" /></View>
                  <View style={[styles.field, { flex: 1 }]}><Text style={styles.label}>Estado</Text><TextInput style={styles.input} placeholder="RS" placeholderTextColor="#CCC" value={estado} onChangeText={(t) => setEstado(formatEstado(t))} autoCapitalize="characters" maxLength={2} /></View>
                </View>
              </View>
            )}

          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextBtn, step === 0 && !tipo && styles.nextBtnDisabled]}
              onPress={avancar}
              activeOpacity={0.85}
              disabled={(step === 0 && !tipo) || loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Text style={styles.nextTxt}>{step === 0 ? 'Continuar' : step === TOTAL_STEPS ? 'Finalizar cadastro' : 'Continuar'}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#fff" />
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#0D0D0D', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, gap: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backTxt: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  stepInfo: { gap: 2 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  stepSub: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  progress: { flexDirection: 'row', gap: 5 },
  dot: { flex: 1, height: 3, borderRadius: 99 },
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 8 },
  tipoWrap: { gap: 12 },
  tipoLabel: { fontSize: 13, color: '#999', marginBottom: 4 },
  tipoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: '#EBEBEB' },
  tipoCardActive: { borderColor: '#111' },
  tipoIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tipoIconActive: { backgroundColor: '#111' },
  tipoIconOff: { backgroundColor: '#F4F4F4' },
  tipoInfo: { flex: 1 },
  tipoNome: { fontSize: 14, fontWeight: '700', color: '#111' },
  tipoDesc: { fontSize: 11, color: '#BBB', marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 99, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#111', backgroundColor: '#111' },
  radioDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: '#fff' },
  fields: { gap: 14 },
  field: { gap: 6 },
  label: { fontSize: 11, fontWeight: '600', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 13, fontSize: 14, color: '#111', borderWidth: 1, borderColor: '#EBEBEB' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F7F7', borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB', paddingRight: 12 },
  eyeBtn: { padding: 4 },
  rowFields: { flexDirection: 'row', gap: 12 },
  footer: { padding: 20, paddingTop: 12 },
  nextBtn: { backgroundColor: '#111', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextBtnDisabled: { backgroundColor: '#CCC' },
  nextTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});