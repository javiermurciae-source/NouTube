import { useState, useEffect } from 'react'
import { Pressable, Text, View, TextInput, ActivityIndicator } from 'react-native'
import { NouText } from '../NouText'
import { settings$ } from '@/states/settings'
import { useValue } from '@legendapp/state/react'

export const AppLockGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const savedKey = useValue(settings$.appLockPinHash)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSaved, setCheckingSaved] = useState(!!savedKey)

  useEffect(() => {
    if (savedKey && checkingSaved) {
      validateKey(savedKey, true);
    }
  }, []);

  const validateKey = async (keyToValidate: string, isAutoCheck: boolean) => {
    if (!keyToValidate) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://13.140.173.154:5050/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          license_key: keyToValidate,
          device: { fingerprint: 'android-device' }
        })
      });
      const data = await res.json();
      if (data.success || data.token) {
        settings$.assign({ appLockPinHash: keyToValidate }); // Save validated key locally
        onUnlock();
      } else {
        if (isAutoCheck) {
          settings$.assign({ appLockPinHash: '' }); // Clear revoked key
          setPin('');
        }
        setError(data.message || 'Licencia inválida o revocada');
      }
    } catch (e) {
      if (isAutoCheck) {
        // If offline, let them in if they already had a key (or block them? Let's block them if we strictly require VPS)
        // Or let them in if network fails but they have a saved key? 
        // For strict piracy control: block them. For offline usage: let them in.
        // Let's allow them in if it's a network error so the app works offline.
        onUnlock();
      } else {
        setError('Error conectando al servidor de licencias');
      }
    } finally {
      setLoading(false);
      setCheckingSaved(false);
    }
  }

  const submit = () => validateKey(pin, false);

  if (checkingSaved) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100 dark:bg-zinc-950">
        <ActivityIndicator size="large" color="#2563eb" />
        <NouText className="mt-4 text-zinc-600 dark:text-zinc-400">Verificando licencia en línea...</NouText>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-100 px-8 dark:bg-zinc-950">
      <NouText className="text-2xl font-bold">Youtubeviwer</NouText>
      <NouText className="mt-2 text-zinc-600 dark:text-zinc-400 text-center">
        Introduce tu KEY de licencia para acceder a la aplicación
      </NouText>
      
      <View className="mt-6 w-full max-w-xs">
        <TextInput
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-lg text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          placeholderTextColor="#666"
          value={pin}
          onChangeText={setPin}
          autoCapitalize="characters"
        />
      </View>

      {error ? <Text className="mt-3 text-red-500 text-center">{error}</Text> : <Text className="mt-3"> </Text>}
      
      <Pressable 
        onPress={submit} 
        disabled={loading || !pin}
        className={`mt-6 rounded-full px-8 py-3 w-full max-w-xs items-center ${loading || !pin ? 'bg-zinc-400' : 'bg-blue-600'}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-semibold text-white">Verificar y Entrar</Text>
        )}
      </Pressable>
    </View>
  )
}
