import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);

  const entrar = () => {
    // Aqui vai chamar a API futuramente
    console.log('Login:', email, senha);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>

          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.backTxt}>Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Bem-vindo de volta</Text>
              <Text style={styles.sub}>Entre na sua conta MOBY</Text>
            </View>
          </SafeAreaView>

          <View style={styles.body}>

            <View style={styles.field}>
              <Text style={styles.label}>Email ou telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                placeholderTextColor="#CCC"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, borderWidth: 0 }]}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#CCC"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!verSenha}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setVerSenha(!verSenha)}
                >
                  <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color="#AAA" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgot}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnEntrar} onPress={entrar} activeOpacity={0.85}>
              <Text style={styles.btnTxt}>Entrar</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.sep}>
              <View style={styles.sepLine} />
              <Text style={styles.sepTxt}>ou</Text>
              <View style={styles.sepLine} />
            </View>

            <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
              <Text style={styles.cadastroTxt}>
                Não tem conta?{' '}
                <Text style={styles.cadastroLink}>Criar conta</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backTxt: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  sub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 3,
  },
  body: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#111',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingRight: 12,
  },
  eyeBtn: {
    padding: 4,
  },
  forgot: {
    fontSize: 12,
    color: '#111',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: -4,
  },
  btnEntrar: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  sep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sepLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#EBEBEB',
  },
  sepTxt: {
    fontSize: 11,
    color: '#CCC',
    fontWeight: '500',
  },
  cadastroTxt: {
    fontSize: 12,
    color: '#BBB',
    textAlign: 'center',
  },
  cadastroLink: {
    color: '#111',
    fontWeight: '600',
  },
});