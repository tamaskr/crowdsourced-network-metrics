import Toast from 'react-native-root-toast'
import { colors } from '../theme/colors'


// Show a short toast message
export function toast(message: string) {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: 120,
    animation: true,
    backgroundColor: colors.primary
  })
}
