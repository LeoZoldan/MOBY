import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

type TipoConta = 'fisica' | 'mei';

const TOTAL_STEPS = 4;

export default function CadastroMotoboyScreen() {
  const [tipo, setTipo] = useState<TipoConta | null>(null);
  const [step, setStep] = useState(0);

  // Pessoa física
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');

  // MEI
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');

  // Comuns
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);

  // Veículo
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');

  // PIX
  const [tipoChave, setTipoChave] = useState('');
  const [chavePix, setChavePix] = useState('');

  const avancar = () => {
    if (step === 0 && tipo) setStep(1);
    else if (step < TOTAL_STEPS) setStep(step + 1);
    else router.replace('/home-motoboy');
  };

  const voltar = () => {
    if (step > 0) setStep(step - 1);
    else router.back();
  };

  const formatCpf = (text: string) => {
    const cpfNumeros = text.replace(/\D/g, '');

    return cpfNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

  const formatNascimento = (text: string) => {
    const numeros = text.replace(/\D/g, '');

    return numeros
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
    };

  const formatTelefone = (text: string) => {
    const numeros = text.replace(/\D/g, '');

    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const formatCNPJ = (text: string) => {
    const cnpjNumeros = text.replace(/\D/g, '');

    return cnpjNumeros
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2');
  };

  const formatAno = (text: string) => {
    return text.replace(/\D/g, '');
};

const formatCor = (text: string) => {
  return text.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
};

  const titulos = ['Tipo de conta', 'Dados pessoais', 'Dados do veículo', 'Documentos', 'Dados bancários'];

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
                <Text style={styles.stepSub}>
                  {step === 0 ? 'Escolha seu perfil' : `Etapa ${step} de ${TOTAL_STEPS}`}
                </Text>
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

            {/* Step 0 — Tipo */}
            {step === 0 && (
              <View style={styles.tipoWrap}>
                <Text style={styles.tipoLabel}>Como você vai se cadastrar?</Text>
                <TouchableOpacity
                  style={[styles.tipoCard, tipo === 'fisica' && styles.tipoCardActive]}
                  onPress={() => setTipo('fisica')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.tipoIcon, tipo === 'fisica' ? styles.tipoIconActive : styles.tipoIconOff]}>
                    <Ionicons name="person-outline" size={22} color={tipo === 'fisica' ? '#fff' : '#999'} />
                  </View>
                  <View style={styles.tipoInfo}>
                    <Text style={styles.tipoNome}>Pessoa física</Text>
                    <Text style={styles.tipoDesc}>CPF e dados pessoais</Text>
                  </View>
                  <View style={[styles.radio, tipo === 'fisica' && styles.radioActive]}>
                    {tipo === 'fisica' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tipoCard, tipo === 'mei' && styles.tipoCardActive]}
                  onPress={() => setTipo('mei')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.tipoIcon, tipo === 'mei' ? styles.tipoIconActive : styles.tipoIconOff]}>
                    <Ionicons name="business-outline" size={22} color={tipo === 'mei' ? '#fff' : '#999'} />
                  </View>
                  <View style={styles.tipoInfo}>
                    <Text style={styles.tipoNome}>MEI / Empresa</Text>
                    <Text style={styles.tipoDesc}>CNPJ e razão social</Text>
                  </View>
                  <View style={[styles.radio, tipo === 'mei' && styles.radioActive]}>
                    {tipo === 'mei' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 1 — Dados pessoais */}
            {step === 1 && (
              <View style={styles.fields}>
                {tipo === 'fisica' ? (
                  <>
                    <View style={styles.field}><Text style={styles.label}>Nome completo</Text><TextInput style={styles.input} placeholder="João da Silva" placeholderTextColor="#CCC" value={nome} onChangeText={setNome} autoCapitalize="words" /></View>
                    <View style={styles.field}><Text style={styles.label}>CPF</Text><TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor="#CCC" value={cpf} onChangeText={(text) => setCpf(formatCpf(text))} keyboardType="numeric" maxLength={14} /></View>
                    <View style={styles.field}><Text style={styles.label}>Data de nascimento</Text><TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#CCC" value={nascimento} onChangeText={(text) => setNascimento(formatNascimento(text))} keyboardType="numeric" maxLength={10} /></View>
                  </>
                ) : (
                  <>
                    <View style={styles.field}><Text style={styles.label}>Razão social</Text><TextInput style={styles.input} placeholder="MEI Transportes Ltda." placeholderTextColor="#CCC" value={razaoSocial} onChangeText={setRazaoSocial} autoCapitalize="words" /></View>
                    <View style={styles.field}><Text style={styles.label}>CNPJ</Text><TextInput style={styles.input} placeholder="00.000.000/0000-00" placeholderTextColor="#CCC" value={cnpj} onChangeText={(text) => setCnpj(formatCNPJ(text))} keyboardType="numeric" maxLength={18} /></View>
                    <View style={styles.field}><Text style={styles.label}>Nome do responsável</Text><TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#CCC" value={nome} onChangeText={setNome} autoCapitalize="words" /></View>
                  </>
                )}
                <View style={styles.field}><Text style={styles.label}>Email</Text><TextInput style={styles.input} placeholder="email@exemplo.com" placeholderTextColor="#CCC" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
                <View style={styles.field}><Text style={styles.label}>Telefone</Text><TextInput style={styles.input} placeholder="(54) 99999-9999" placeholderTextColor="#CCC" value={telefone} onChangeText={(text) => setTelefone(formatTelefone(text))} keyboardType="phone-pad" maxLength={15} /></View>
                <View style={styles.field}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.inputRow}>
                    <TextInput style={[styles.input, { flex: 1 }]} placeholder="Mínimo 8 caracteres" placeholderTextColor="#CCC" value={senha} onChangeText={setSenha} secureTextEntry={!verSenha} />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setVerSenha(!verSenha)}>
                      <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color="#AAA" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Step 2 — Veículo */}
            {step === 2 && (
              <View style={styles.fields}>
                <View style={styles.field}><Text style={styles.label}>Placa da moto</Text><TextInput style={styles.input} placeholder="ABC-1234" placeholderTextColor="#CCC" value={placa} onChangeText={setPlaca} autoCapitalize="characters" maxLength={8} /></View>
                <View style={styles.field}><Text style={styles.label}>Modelo da moto</Text><TextInput style={styles.input} placeholder="Honda CG 160" placeholderTextColor="#CCC" value={modelo} onChangeText={setModelo} autoCapitalize="words" /></View>
                <View style={styles.row}>
                  <View style={[styles.field, { flex: 1 }]}><Text style={styles.label}>Ano</Text><TextInput style={styles.input} placeholder="2021" placeholderTextColor="#CCC" value={ano} onChangeText={(text) => setAno(formatAno(text))} keyboardType="numeric" maxLength={4} /></View>
                  <View style={[styles.field, { flex: 1 }]}><Text style={styles.label}>Cor</Text><TextInput style={styles.input} placeholder="Vermelha" placeholderTextColor="#CCC" value={cor} onChangeText={(text) => setCor(formatCor(text))} autoCapitalize="words" /></View>
                </View>
              </View>
            )}

            {/* Step 3 — Documentos */}
            {step === 3 && (
              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.label}>Foto da CNH</Text>
                  <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
                    <View style={styles.uploadIcon}><Ionicons name="cloud-upload-outline" size={22} color="#AAA" /></View>
                    <Text style={styles.uploadTxt}>Toque para enviar</Text>
                    <Text style={styles.uploadSub}>JPG ou PNG</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Documento do veículo (CRLV)</Text>
                  <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
                    <View style={styles.uploadIcon}><Ionicons name="cloud-upload-outline" size={22} color="#AAA" /></View>
                    <Text style={styles.uploadTxt}>Toque para enviar</Text>
                    <Text style={styles.uploadSub}>JPG ou PNG</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle-outline" size={16} color="#888" />
                  <Text style={styles.infoTxt}>Os documentos serão analisados em até 24h. Você receberá uma confirmação por email.</Text>
                </View>
              </View>
            )}

            {/* Step 4 — PIX */}
            {step === 4 && (
              <View style={styles.fields}>
                <View style={styles.infoBox}>
                  <Ionicons name="wallet-outline" size={16} color="#888" />
                  <Text style={styles.infoTxt}>O pagamento das suas corridas será enviado para sua chave PIX após o saque.</Text>
                </View>
                <View style={styles.field}><Text style={styles.label}>Tipo de chave PIX</Text><TextInput style={styles.input} placeholder="CPF, Email, Telefone ou Aleatória" placeholderTextColor="#CCC" value={tipoChave} onChangeText={setTipoChave} /></View>
                <View style={styles.field}><Text style={styles.label}>Chave PIX</Text><TextInput style={styles.input} placeholder="Digite sua chave" placeholderTextColor="#CCC" value={chavePix} onChangeText={setChavePix} autoCapitalize="none" /></View>
                <View style={styles.successBox}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#3B6D11" />
                  <Text style={styles.successTxt}>Seus dados estão protegidos com criptografia.</Text>
                </View>
              </View>
            )}

          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextBtn, step === 0 && !tipo && styles.nextBtnDisabled]}
              onPress={avancar}
              activeOpacity={0.85}
              disabled={step === 0 && !tipo}
            >
              <Text style={styles.nextTxt}>
                {step === TOTAL_STEPS ? 'Finalizar cadastro' : 'Continuar'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
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
  row: { flexDirection: 'row', gap: 12 },
  uploadBox: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 20, alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: '#DDD', borderStyle: 'dashed' },
  uploadIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center' },
  uploadTxt: { fontSize: 12, fontWeight: '600', color: '#888' },
  uploadSub: { fontSize: 10, color: '#BBB' },
  infoBox: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderWidth: 1, borderColor: '#EBEBEB' },
  infoTxt: { flex: 1, fontSize: 12, color: '#888', lineHeight: 18 },
  successBox: { backgroundColor: '#EAF3DE', borderRadius: 12, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderWidth: 1, borderColor: '#C0DD97' },
  successTxt: { flex: 1, fontSize: 12, color: '#3B6D11', lineHeight: 18 },
  footer: { padding: 20, paddingTop: 12 },
  nextBtn: { backgroundColor: '#111', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextBtnDisabled: { backgroundColor: '#CCC' },
  nextTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
});