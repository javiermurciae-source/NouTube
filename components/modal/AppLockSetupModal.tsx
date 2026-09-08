import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useValue } from '@legendapp/state/react'
import { ui$ } from '@/states/ui'
import { settings$ } from '@/states/settings'
import { clearAppLock, isValidPinFormat, setAppPin, verifyPin } from '@/lib/app-lock'
import { showToast } from '@/lib/toast'
import { BaseCenterModal } from './BaseCenterModal'
import { NouText } from '../NouText'
import { nIf } from '@/lib/utils'

export const AppLockSetupModal: React.FC = () => {
  const open = useValue(ui$.appLockSetupOpen)
  const hasPin = useValue(settings$.appLockPinHash)
  const [current, setCurrent] = useState('')
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')

  if (!open) return null

  const close = () => {
    ui$.appLockSetupOpen.set(false)
    setCurrent('')
    setPin1('')
    setPin2('')
  }

  const save = () => {
    if (hasPin && !verifyPin(current)) {
      showToast('PIN actual incorrecto')
      return
    }
    if (!isValidPinFormat(pin1)) {
      showToast('PIN debe ser 4-8 dígitos')
      return
    }
    if (pin1 !== pin2) {
      showToast('Los PIN no coinciden')
      return
    }
    setAppPin(pin1)
    showToast('PIN guardado')
    close()
  }

  return (
    <BaseCenterModal onClose={close}>
      <View className="p-5">
        <NouText className="text-lg font-bold">{hasPin ? 'Cambiar PIN' : 'Crear PIN'}</NouText>
        <NouText className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          4-8 dígitos. Se pedirá al abrir la app.
        </NouText>
        {nIf(
          Boolean(hasPin),
          <TextInput
            className="mt-4 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            value={current}
            onChangeText={setCurrent}
            placeholder="PIN actual"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            secureTextEntry
            maxLength={8}
          />,
        )}
        <TextInput
          className="mt-3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          value={pin1}
          onChangeText={setPin1}
          placeholder="Nuevo PIN"
          placeholderTextColor="#71717a"
          keyboardType="numeric"
          secureTextEntry
          maxLength={8}
        />
        <TextInput
          className="mt-3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          value={pin2}
          onChangeText={setPin2}
          placeholder="Confirmar PIN"
          placeholderTextColor="#71717a"
          keyboardType="numeric"
          secureTextEntry
          maxLength={8}
        />
        <View className="mt-5 flex-row justify-end gap-3">
          {nIf(
            Boolean(hasPin),
            <Pressable
              onPress={() => {
                if (!verifyPin(current)) {
                  showToast('PIN actual incorrecto')
                  return
                }
                clearAppLock()
                showToast('Bloqueo desactivado')
                close()
              }}
              className="rounded-full px-4 py-2"
            >
              <Text className="text-red-500">Quitar</Text>
            </Pressable>,
          )}
          <Pressable onPress={close} className="rounded-full px-4 py-2">
            <Text>Cancelar</Text>
          </Pressable>
          <Pressable onPress={save} className="rounded-full bg-blue-600 px-5 py-2">
            <Text className="font-semibold text-white">Guardar</Text>
          </Pressable>
        </View>
      </View>
    </BaseCenterModal>
  )
}
