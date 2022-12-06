import { useState, useEffect, useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, StyleSheet, View, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { logger } from '../utils/logger'
import { Measurement } from '../types/types'
import { HistoryCard } from '../components/HistoryCard'
import { colors } from '../theme/colors'
import { toast } from '../utils/toast'


// Logger tag
const TAG = 'HistoryScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gray100
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 72,
    color: colors.black,
    paddingHorizontal: 10
  },
  list: {
    flexGrow: 1
  },
  card: {
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 10
  },
  emptyTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.gray500
  }
})

function HistoryScreen() {
  // Local state for storing measurement history data and loading
  const [ history, setHistory ] = useState<Measurement[]>()
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const { t } = useTranslation()


  // Access AsyncStorage to retrieve user measurement history
  const getMeasurementHistory = useCallback(async () => {
    try {
      logger.log(TAG, 'Fetching measurement history...')
      const history = await AsyncStorage.getItem('history')
      const parsedHistory = history ? JSON.parse(history) : []
      // Sort array by timestamp
      setHistory(parsedHistory.sort((a: Measurement, b: Measurement) => b.timestamp - a.timestamp))
      logger.log(TAG, 'Fetching measurement history successful')
    } catch {
      logger.log(TAG, 'Error while fetching measurement history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch measurement history data on first render
  useEffect(() => {
    getMeasurementHistory()
  }, [ getMeasurementHistory ])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('historyPage.historyTitle')}</Text>
      <FlatList
        data={history}
        contentContainerStyle={styles.list}
        onRefresh={() => {
          setIsLoading(true)
          getMeasurementHistory().then(() => {
            toast(t('historyPage.historyRfshToast'))
          })
        }}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <HistoryCard measurement={item} style={styles.card} key={item.id} />
        )}
        ListEmptyComponent={() =>
          !isLoading ? (
            <View style={styles.emptyTextContainer}>
              <Text style={styles.emptyText}>
                {t('historyPage.noDataYet')}
              </Text>
            </View>
          ) : null
        }
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

export default HistoryScreen
