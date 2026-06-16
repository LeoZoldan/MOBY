import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const configurarNotificacoes = () => {
  // Configuração feita no app.json
};

export const registrarNotificacoes = async (): Promise<string | null> => {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'MOBY',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6500',
    });
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch {
    return null;
  }
};

export const notificarLocal = async (titulo: string, corpo: string, dados?: any) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: corpo,
        data: dados || {},
      },
      trigger: null,
    });
  } catch (err) {
    console.log('Erro ao notificar:', err);
  }
};