import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { verifyPin } from '@/lib/app-lock'
import { NouText } from '../NouText'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back']

export const AppLockGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const submit = (value: string) => {
    if (verifyPin(value)) {
      setPin('')
      setError('')
      onUnlock()
    } else {
      setError('PIN incorrecto')
      setPin('')
    }
  }

  const press = (key: string) => {
    if (key === 'back') {
      setPin((p) => p.slice(0, -1))
      return
    }
    if (!key) return
    const next = (pin + key).slice(0, 8)
    setPin(next)
    if (next.length >= 4) {
      if (verifyPin(next)) {
        setPin('')
        setError('')
        onUnlock()
      } else if (next.length === 8) {
        setError('PIN incorrecto')
        setPin('')
      }
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-100 px-8 dark:bg-zinc-950">
      <NouText className="text-2xl font-bold">Youtubeviwer</NouText>
      <NouText className="mt-2 text-zinc-600 dark:text-zinc-400">Introduce tu clave para desbloquear</NouText>
      <View className="mt-6 flex-row gap-3">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <View
            key={i}
            className={`h-4 w-4 rounded-full border ${pin.length > i ? 'bg-blue-600 border-blue-600' : 'border-zinc-400 dark:border-zinc-600'}`}
          />
        ))}
      </View>
      {error ? <Text className="mt-3 text-red-500">{error}</Text> : <Text className="mt-3"> </Text>}
      <View className="mt-4 w-full max-w-xs flex-row flex-wrap justify-center gap-3">
        {KEYS.map((k, i) =>
          k === '' ? (
            <View key={i} className="h-16 w-16" />
          ) : (
            <Pressable
              key={i}
              onPress={() => press(k)}
              className="h-16 w-16 items-center justify-center rounded-full bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-900 dark:active:bg-zinc-800"
            >
              <NouText className="text-2xl font-semibold">{k === 'back' ? '⌫' : k}</NouText>
            </Pressable>
          ),
        )}
      </View>
      {pin.length >= 4 ? (
        <Pressable onPress={() => submit(pin)} className="mt-6 rounded-full bg-blue-600 px-8 py-3">
          <Text className="font-semibold text-white">Desbloquear</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
