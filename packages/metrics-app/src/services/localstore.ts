import AsyncStorage from '@react-native-async-storage/async-storage'
import { Measurement } from '../types/measurement'

export async function storeData(value: unknown): Promise<void> {
  try {
    const oldValues = await AsyncStorage.getItem('@history')
    const oldvaluesArray = JSON.parse(oldValues ?? '[]')
    oldvaluesArray.push(value)
    const measurements = JSON.stringify(oldvaluesArray)
    await AsyncStorage.setItem('@history', measurements)
  } catch (error) {
    console.log(error)
  }
}

export async function getData(): Promise<Measurement[]> {
  try {
    const savedData = await AsyncStorage.getItem('@history')
    console.log('savedata', savedData)
    return savedData !== null ? JSON.parse(savedData) : []
  } catch (error) {
    console.log(error)
    return []
  }
}
