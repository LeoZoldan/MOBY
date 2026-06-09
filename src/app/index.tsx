import {
  StyleSheet, Text, View, TouchableOpacity, Image, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.container}>

        <View style={styles.diagonalBg} />

        <SafeAreaView style={styles.safe}>

          <View style={styles.top}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImg}
                resizeMode="cover"
              />
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.appName}>MOBY</Text>
              <Text style={styles.tagline}>Entregas sob demanda, agora.</Text>
            </View>
          </View>

          <View style={styles.bottom}>

            <TouchableOpacity style={styles.cardCliente} activeOpacity={0.85} onPress={() => router.push('/cadastro-cliente')}>
              <View style={styles.iconCliente}>
                <Ionicons name="person-outline" size={22} color="#fff" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.titleCliente}>Sou Cliente</Text>
                <Text style={styles.subCliente}>Solicitar entrega agora</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardMotoboy} activeOpacity={0.85} onPress={() => router.push('/cadastro-motoboy')}>
              <View style={styles.iconMotoboy}>
                <MaterialCommunityIcons name="moped" size={24} color="#333" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.titleMotoboy}>Sou Motoboy</Text>
                <Text style={styles.subMotoboy}>Receber corridas agora</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.7} onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>
                Já tem conta?{'  '}
                <Text style={styles.loginLink}>Entrar</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  diagonalBg: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '52%',
    backgroundColor: '#0D0D0D',
    transform: [{ skewY: '-4deg' }, { translateY: -80 }],
  },
  safe: { flex: 1 },
  top: {
    paddingTop: 40,
    paddingHorizontal: 26,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  logoImg: {
    width: 68,
    height: 68,
  },
  titleRow: { flex: 1 },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 5,
    color: '#fff',
  },
  tagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  bottom: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'flex-end',
    gap: 11,
  },
  cardCliente: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCliente: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  titleCliente: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  subCliente: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
  cardMotoboy: {
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  iconMotoboy: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: '#ECECEC',
    alignItems: 'center', justifyContent: 'center',
  },
  titleMotoboy: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 2 },
  subMotoboy: { fontSize: 10, color: '#BBB' },
  cardText: { flex: 1 },
  loginBtn: { marginTop: 4 },
  loginText: { fontSize: 11, color: '#CCC', textAlign: 'center' },
  loginLink: { color: '#111', fontWeight: '600' },
});