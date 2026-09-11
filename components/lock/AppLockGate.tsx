import { useState } from 'react'
import { Pressable, Text, View, TextInput, ActivityIndicator } from 'react-native'
import { NouText } from '../NouText'
import { settings$ } from '@/states/settings'

export const AppLockGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!pin) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://13.140.173.154:5050/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          license_key: pin,
          device: { fingerprint: 'android-device' }
        })
      });
      const data = await res.json();
      if (data.success || data.token) {
        settings$.assign({ appLockPinHash: pin }); // Save validated key locally
        onUnlock();
      } else {
        setError(data.message || 'Licencia inválida');
      }
    } catch (e) {
      setError('Error conectando al VPS');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-100 px-8 dark:bg-zinc-950">
      <NouText className="text-2xl font-bold">Youtubeviwer</NouText>
      <NouText className="mt-2 text-zinc-600 dark:text-zinc-400">Introduce tu KEY de licencia</NouText>
      
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

      {error ? <Text className="mt-3 text-red-500">{error}</Text> : <Text className="mt-3"> </Text>}
      
      <Pressable 
        onPress={submit} 
        disabled={loading || !pin}
        className={`mt-6 rounded-full px-8 py-3 ${loading || !pin ? 'bg-zinc-400' : 'bg-blue-600'}`}
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
