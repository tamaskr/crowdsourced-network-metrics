import AsyncStorage from '@react-native-async-storage/async-storage'
import { logger } from './logger'


// Logger tag
const TAG = 'Tutorial'

// AsyncStorage key
const STORAGE_KEY = '@cmnm/tutorial'

// Check if the user has seen the tutorial
export async function getUserHasSeenTutorial(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY)
    const result = value !== null
    logger.log(TAG, 'Checked if the user has seen the tutorial, result =', result)
    return result
  } catch (error) {
    logger.error(TAG, 'Failed to check if the user has seen the tutorial', error)
    return false
  }
}

// Save that the user has seen the tutorial
export async function setUserHasSeenTutorial(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'true')
    logger.log(TAG, 'Saved that the user has seen the tutorial')
  } catch (error) {
    logger.error(TAG, 'Failed to save that the user has seen the tutorial', error)
  }
}
