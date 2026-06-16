import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { io as socketIO } from 'socket.io-client';
import { meusPedidos } from '../services/api';

const BASE_URL = 'http://192.168.5.102:3000';

export default function AguardandoMotoboyScreen() {
  const socketRef = useRef<any>(null);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  useEffect(() => {
    buscarPedidoAtual();
  }, []);

  useEffect(() => {
    if (!pedidoId) return;

    const socket = socketIO(BASE_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('pedido:acompanhar', pedidoId);
    });

    socket.on('pedido:aceito', () => {
      router.replace('/corrida-andamento' as any);
    });

    return () => {
      socket.disconnect();
    };
  }, [pedidoId]);

  // Verifica também via polling a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await meusPedidos();
        if (Array.isArray(data)) {
          const ativo = data.find((p: any) => p.status === 'aceito' || p.status === 'coletado');
          if (ativo) {
            router.replace('/corrida-andamento' as any);
          }
        }
      } catch (err) {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const buscarPedidoAtual = async () => {
    try {
      const data = await meusPedidos();
      if (Array.isArray(data)) {
        const aguardando = data.find((p: any) => p.status === 'aguardando');
        if (aguardando) setPedidoId(aguardando.id);
      }
    } catch (err) {}
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E8E4" />
      <View style={styles.container}>

        <View style={styles.map}>
          <Ionicons name="map-outline" size={32} color="#CCC" />
          <Text style={styles.mapTxt}>Localizando motoboys...</Text>
          <View style={[styles.mbPin, { top: '30%', left: '25%' } as any]}>
            <MaterialCommunityIcons name="moped" size={14} color="#fff" />
          </View>
          <View style={[styles.mbPin, { top: '45%', left: '60%' } as any]}>
            <MaterialCommunityIcons name="moped" size={14} color="#fff" />
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusTxt}>Procurando motoboy...</Text>
          </View>
          <Text style={styles.statusSub}>Aguardando motoboy disponível</Text>

          <View style={styles.motoboysList}>
            <View style={styles.mbPill}>
              <View style={styles.mbAvatar}>
                <Ionicons name="person-outline" size={14} color="#999" />
              </View>
              <View>
                <Text style={styles.mbNome}>Buscando...</Text>
                <Text style={styles.mbDist}>próximo</Text>
              </View>
            </View>
            <View style={styles.mbPill}>
              <View style={styles.mbAvatar}>
                <Ionicons name="time-outline" size={14} color="#999" />
              </View>
              <View>
                <Text style={styles.mbNome}>Aguarde</Text>
                <Text style={styles.mbDist}>~5 min</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.btnCancelarTxt}>Cancelar pedido</Text>
          </TouchableOpacity>
        </View>

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
  mbPin: {
    position: 'absolute', width: 32, height: 32, borderRadius: 99,
    backgroundColor: '#111', borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 18, paddingBottom: 32, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 10,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: '#F5A623' },
  statusTxt: { fontSize: 14, fontWeight: '700', color: '#111' },
  statusSub: { fontSize: 11, color: '#BBB', marginTop: -4 },
  motoboysList: { flexDirection: 'row', gap: 8 },
  mbPill: {
    flex: 1, backgroundColor: '#F7F7F7', borderRadius: 12, padding: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#EBEBEB',
  },
  mbAvatar: {
    width: 28, height: 28, borderRadius: 99, backgroundColor: '#EBEBEB',
    alignItems: 'center', justifyContent: 'center',
  },
  mbNome: { fontSize: 11, fontWeight: '600', color: '#111' },
  mbDist: { fontSize: 10, color: '#BBB' },
  btnCancelar: {
    borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#EBEBEB',
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  btnCancelarTxt: { fontSize: 13, fontWeight: '600', color: '#AAA' },
});