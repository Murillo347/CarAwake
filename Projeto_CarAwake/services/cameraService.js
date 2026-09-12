import { Camera } from 'expo-camera';
import { Linking, Alert, Platform } from 'react-native';

export const requestCameraAccess = async () => {
  try {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      return { success: true };
    }

    if (!canAskAgain) {
      Alert.alert(
        'Permissão Necessária',
        'O acesso à câmera foi bloqueado permanentemente. É necessário habilitar manualmente nas configurações do sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir Configurações',
            onPress: () => {
              if (Platform.OS === 'ios') Linking.openURL('app-settings:');
              else Linking.openSettings();
            }
          }
        ]
      );
      return { success: false, error: 'canAskAgain_false' };
    }

    return { success: false, error: 'Permissão negada' };
  } catch (error) {
    return { success: false, error: 'Câmera indisponível no momento' };
  }
};
