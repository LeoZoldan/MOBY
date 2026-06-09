import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro-motoboy" />
      <Stack.Screen name="cadastro-cliente" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home-cliente" />
      <Stack.Screen name="home-motoboy" />
      <Stack.Screen name="definir-endereco" />
      <Stack.Screen name="confirmar-pedido" />
      <Stack.Screen name="aguardando-motoboy" />
      <Stack.Screen name="corrida-andamento" />
      <Stack.Screen name="corrida-finalizada" />
      <Stack.Screen name="mb-corrida-disponivel" />
      <Stack.Screen name="mb-a-caminho" />
      <Stack.Screen name="mb-finalizada" />
      <Stack.Screen name="perfil-motoboy" />
      <Stack.Screen name="perfil-cliente" />
      <Stack.Screen name="editar-perfil-cliente" />
      <Stack.Screen name="editar-perfil-motoboy" />
      <Stack.Screen name="saque" />
    </Stack>
  );
}