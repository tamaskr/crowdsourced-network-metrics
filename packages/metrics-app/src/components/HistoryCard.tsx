import { Fragment } from 'react'
import { format } from 'date-fns'
import { View, StyleSheet, Text, ViewStyle } from 'react-native'
import { Divider } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { colors } from '../theme/colors'
import { Measurement, MeasurementType } from '../types/measurement'


const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: colors.background.white,
    shadowColor: colors.black,
    elevation: 3
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  divider: {
    marginVertical: 10
  },
  measurementContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  measurementIcon: {
    marginRight: 10
  },
  measurementLabel: {
    color: colors.gray500
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: '500'
  }
})

interface HistoryCardProps {
  measurement: Measurement
  style?: ViewStyle
}

// Returns all the properties that are needed to display the measurements
const getMeasurementData = (measurement: MeasurementType) => {
  switch (measurement) {
    case MeasurementType.BANDWIDTH: {
      return { label: 'Bandwidth', icon: 'collapse-all-outline', unit: 'Mbit/s' }
    }
    case MeasurementType.LATENCY: {
      return { label: 'Latency', icon: 'clock-fast', unit: 'ms' }
    }
    case MeasurementType.SIGNAL_STRENGTH: {
      return { label: 'Signal strength', icon: 'signal' }
    }
  }
}

export const HistoryCard = ({ measurement, style }: HistoryCardProps) => {
  const date = format(new Date(measurement.timestamp), 'yyyy MMMM dd pp')

  return (
    <View style={[ styles.container, style ]}>
      <View style={styles.dateContainer}>
        <Text>{date}</Text>
      </View>
      {Object.values(MeasurementType).map(m => {
        const { label, icon, unit } = getMeasurementData(m)
        // Measurement value with unit
        const value = measurement[m] ? `${measurement[m]} ${unit ?? ''}` : '-'
        return (
          <Fragment key={m}>
            <Divider style={styles.divider} />
            <View key={m} style={styles.measurementContainer}>
              <MaterialCommunityIcons
                name={icon}
                color={colors.black}
                size={36}
                style={styles.measurementIcon}
              />
              <View>
                <Text style={styles.measurementLabel}>{label}</Text>
                <Text style={styles.measurementValue}>{value}</Text>
              </View>
            </View>
          </Fragment>
        )
      })}
    </View>
  )
}
