import { useState, useEffect, useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, StyleSheet, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Measurement } from '../types/types'
import { HistoryCard } from '../components/HistoryCard'
import { colors } from '../theme/colors'
import { toast } from '../utils/toast'
import { getMeasurementHistory } from '../utils/history'


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

export default function HistoryScreen() {
  const { t } = useTranslation()
  const [ isLoading, setIsLoading ] = useState(true)
  const [ history, setHistory ] = useState<Measurement[]>([])

  // Get the measurement history and sort it in descending order by timestamp
  const getSortedMeasurementHistory = useCallback(async () => {
    setIsLoading(true)
    const measurements = await getMeasurementHistory()
    setHistory(measurements.sort((a: Measurement, b: Measurement) => b.timestamp - a.timestamp))
    setIsLoading(false)
  }, [])

  // Fetch measurement history data on first render
  useEffect(() => {
    getSortedMeasurementHistory()
  }, [ getSortedMeasurementHistory ])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('historyPage.historyTitle')}</Text>
      <FlatList
        data={history}
        contentContainerStyle={styles.list}
        onRefresh={() => {
          getSortedMeasurementHistory().then(() => {
            toast(t('historyPage.historyRfshToast'))
          })
        }}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <HistoryCard measurement={item} style={styles.card} key={item.id} />
        )}
        ListEmptyComponent={() => isLoading ? null : (
          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyText}>
              {t('historyPage.noDataYet')}
            </Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}
