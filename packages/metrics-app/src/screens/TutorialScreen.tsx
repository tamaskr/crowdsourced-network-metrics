/* eslint-disable react-native/no-inline-styles */
import { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/core'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Carousel } from 'react-native-ui-lib'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '../theme/colors'
import { logger } from '../utils/logger'

// Logger tag
const TAG = 'TutorialScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gray100,
    padding: 10
  },
  pageContainer: {
    flex: 1,
    marginBottom: 80
  },
  iconContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 72,
    color: colors.black,
    paddingHorizontal: 10,
    textAlign: 'center'
  },
  description: { textAlign: 'center', padding: 10 },
  nextButton: {
    marginTop: 20,
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background.white
  }
})

const pages = [
  {
    title: 'tutorial.welcomeTitle',
    description: 'tutorial.welcomeDescription',
    icon: 'sitemap-outline'
  },
  {
    title: 'tutorial.explanationTitle',
    description: 'tutorial.explanationDescription',
    icon: 'wifi'
  },
  {
    title: 'tutorial.permissionTitle',
    description: 'tutorial.permissionDescription',
    icon: 'text-box-check'
  }
]

const TutorialScreen = () => {
  const [ currentPage, setCurrentPage ] = useState<number>(0)
  const carouselRef = useRef<any | undefined>()
  const { t } = useTranslation()
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        ref={carouselRef}
        containerStyle={{ height: '80%' }}
        pageControlProps={{
          size: 10
        }}
        onChangePage={(currentPage: number, _: unknown) => {
          setCurrentPage(currentPage)
          carouselRef.current.setState({ currentPage })
        }}
        autoPlay={true}
        pageControlPosition={Carousel.pageControlPositions.OVER}
      >
        {pages.map(({ title, description, icon }) => (
          <View key={title} style={styles.pageContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={icon}
                color={colors.primary}
                size={156}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{t(title)}</Text>
              <Text style={styles.description}>{t(description)}</Text>
            </View>
          </View>
        ))}
      </Carousel>
      <TouchableOpacity
        onPress={async () => {
          if (currentPage < 2) {
            setCurrentPage(prevPage => prevPage + 1)
            carouselRef.current.goToPage(currentPage + 1, false)
            return
          }
          try {
            await AsyncStorage.setItem('hasShownTutorial', 'true')
            logger.log(TAG, 'Tutorial token has been saved')
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }]
            }))
          } catch {
            logger.log(TAG, 'Error while saving tutorial token')
          }
        }}
        style={styles.nextButton}
      >
        <Text style={styles.nextButtonText}>
          {t(currentPage === 2 ? 'tutorial.done' : 'tutorial.next')}
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

export default TutorialScreen
